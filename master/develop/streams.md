# Streams

<WrappedSection>

immudb provides stream capabilities.
Internally it uses “delimited” messages technique, every chunk has a trailer that describe the length of the message. In this way the receiver can recompose chunk by chunk the original payload.
Stream methods accepts a `readers` as a part of input and output arguments. In this way the large value is decomposed in small chunks that are streamed over the wire.
Client don't need to allocate the entire value when sending and can read the received one progressively.
For example a client could send a large file much greater than available ram memory.
> At the moment `immudb` is not yet able to write the data without allocating the entire received object, but in the next release it will be possible a complete communication without allocations.
The maximum size of a transaction sent with streams is temporarily limited to a payload of 32M.

Supported stream method now available in the SDK are:

<CustomList class="no-horizontal-padding" size="wide">

* StreamSet
* StreamGet
* StreamVerifiedSet
* StreamVerifiedGet
* StreamScan
* StreamZScan
* StreamHistory
* StreamExecAll

</CustomList>

</WrappedSection>

<Tabs groupId="languages">

<TabItem value="go" label="Go" default>
Here an example on how to send a large file and a regular key value to immudb.

It's possible to specify the chunk size of the stream with `WithStreamChunkSize()` method.

```go
package main

import (
	"bytes"
	"context"
	"fmt"
	"log"
	"os"

	"github.com/codenotary/immudb/pkg/api/schema"
	immudb "github.com/codenotary/immudb/pkg/client"
	"github.com/codenotary/immudb/pkg/stream"
)

func main() {
	opts := immudb.DefaultOptions().
		WithAddress("localhost").
		WithPort(3322)

	client := immudb.NewClient().WithOptions(opts)
	err := client.OpenSession(
		context.TODO(),
		[]byte(`immudb`),
		[]byte(`immudb`),
		"defaultdb",
	)
	if err != nil {
		log.Fatal(err)
	}

	defer client.CloseSession(context.TODO())

	myFileName := "main.go"
	key1 := []byte("key1")
	val1 := []byte("val1")
	f, err := os.Open(myFileName)
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()
	stats, err := os.Stat(myFileName)
	if err != nil {
		log.Fatal(err)
	}

	kv1 := &stream.KeyValue{
		Key: &stream.ValueSize{
			Content: bytes.NewBuffer(key1),
			Size:    len(key1),
		},
		Value: &stream.ValueSize{
			Content: bytes.NewBuffer(val1),
			Size:    len(val1),
		},
	}
	kv2 := &stream.KeyValue{
		Key: &stream.ValueSize{
			Content: bytes.NewBuffer([]byte(myFileName)),
			Size:    len(myFileName),
		},
		Value: &stream.ValueSize{
			Content: f,
			Size:    int(stats.Size()),
		},
	}

	kvs := []*stream.KeyValue{kv1, kv2}
	_, err = client.StreamSet(context.TODO(), kvs)
	if err != nil {
		log.Fatal(err)
	}
	entry, err := client.StreamGet(
		context.TODO(),
		&schema.KeyRequest{
			Key: []byte(myFileName),
		},
	)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("returned key %s", entry.Key)
}
```

</TabItem>


<TabItem value="java" label="Java">

```java
package io.codenotary.immudb.helloworld;

import java.util.Arrays;

import io.codenotary.immudb4j.Entry;
import io.codenotary.immudb4j.FileImmuStateHolder;
import io.codenotary.immudb4j.ImmuClient;

public class App {

    public static void main(String[] args) {

        ImmuClient client = null;

        try {

            FileImmuStateHolder stateHolder = FileImmuStateHolder.newBuilder()
                    .withStatesFolder("./immudb_states")
                    .build();

            client = ImmuClient.newBuilder()
                    .withServerUrl("127.0.0.1")
                    .withServerPort(3322)
                    .withStateHolder(stateHolder)
                    .build();

            client.openSession("defaultdb", "immudb", "immudb");

            byte[] value1 = { 0, 1, 2, 3 };

            client.streamSet("key1", value1);

            Entry entry = client.streamGet("key1");

            System.out.format("('%s', '%s')\n", new String(entry.getKey()), Arrays.toString(entry.getValue()));

            client.closeSession();

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (client != null) {
                try {
                    client.shutdown();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }

    }

}
```

</TabItem>


<TabItem value="python" label="Python">

Streams is not supported yet in this language SDK.
Do you want to make a feature request or help out? Open an issue on [Python sdk github project](https://github.com/codenotary/immudb-py/issues/new)

</TabItem>


<TabItem value="node.js" label="Node.js">

Streams is not supported yet in this language SDK.
Do you want to make a feature request or help out? Open an issue on [Node.js sdk github project](https://github.com/codenotary/immudb-node/issues/new)

</TabItem>


<TabItem value="net" label=".NET">

Streams is not supported yet in this language SDK.
Do you want to make a feature request or help out? Open an issue on [.Net sdk github project](https://github.com/codenotary/immudb4net/issues/new)

</TabItem>


<TabItem value="other" label="Others">

If you're using another development language, please refer to the <a href="/connecting/immugw">immugw</a> option.

</TabItem>


</Tabs>

### Chunked reading

It's possible to read returned value chunk by chunk if needed. This grant to the clients capabilities to handle data coming from immudb  chunk by chunk

<Tabs groupId="languages">

<TabItem value="go" label="Go" default>

To read chunk by chunk the inner gRPC protobuffer client is needed.
Then it's possible to use `kvStreamReceiver` to retrieve the key and a value reader. Such reader will fill provided byte array with received data and will return the number of read bytes or error.
If no message is present it returns 0 and io.EOF. If the message is complete it returns 0 and nil, in that case successive calls to Read will returns a new message.

> There are several receivers available (zStreamReceiver, vEntryStreamReceiver, execAllStreamReceiver) and also a primitive receiver MsgReceiver. The last one can be used to receive a simple row []byte message without additional logics.

```go
package main

import (
	"context"
	"fmt"
	"io"
	"log"

	"github.com/codenotary/immudb/pkg/api/schema"
	immudb "github.com/codenotary/immudb/pkg/client"
	"github.com/codenotary/immudb/pkg/stream"
)

func main() {
	opts := immudb.DefaultOptions().
		WithAddress("localhost").
		WithPort(3322)

	client := immudb.NewClient().WithOptions(opts)
	err := client.OpenSession(
		context.TODO(),
		[]byte(`immudb`),
		[]byte(`immudb`),
		"defaultdb",
	)
	if err != nil {
		log.Fatal(err)
	}

	defer client.CloseSession(context.TODO())

	sc := client.GetServiceClient()
	gs, err := sc.StreamGet(
		context.TODO(),
		&schema.KeyRequest{
			Key: []byte("key"),
		},
	)
	if err != nil {
		log.Fatal(err)
	}
	kvr := stream.NewKvStreamReceiver(
		stream.NewMsgReceiver(gs),
		stream.DefaultChunkSize,
	)

	key, vr, err := kvr.Next()
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("read %s key", key)

	chunk := make([]byte, 4096)
	for {
		l, err := vr.Read(chunk)
		if err != nil && err != io.EOF {
			log.Fatal(err)
		}
		if err == io.EOF {
			break
		}
		fmt.Printf("read %d byte\n", l)
	}
}
```
</TabItem>


<TabItem value="java" label="Java">

Streams is not supported yet in this language SDK.
Do you want to make a feature request or help out? Open an issue on [Java sdk github project](https://github.com/codenotary/immudb4j/issues/new)

</TabItem>


<TabItem value="python" label="Python">

Streams is not supported yet in this language SDK.
Do you want to make a feature request or help out? Open an issue on [Python sdk github project](https://github.com/codenotary/immudb-py/issues/new)

</TabItem>


<TabItem value="node.js" label="Node.js">

Streams is not supported yet in this language SDK.
Do you want to make a feature request or help out? Open an issue on [Node.js sdk github project](https://github.com/codenotary/immudb-node/issues/new)

</TabItem>


<TabItem value="net" label=".NET">

Streams is not supported yet in this language SDK.
Do you want to make a feature request or help out? Open an issue on [.Net sdk github project](https://github.com/codenotary/immudb4net/issues/new)

</TabItem>


<TabItem value="other" label="Others">

If you're using another development language, please refer to the <a href="/connecting/immugw">immugw</a> option.

</TabItem>

</Tabs>
