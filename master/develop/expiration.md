# Data Expiration

It's possible to achieve data expiration by using the `ExpirableSet` function. It provides logical deletion, it means that it is not physically deleted from db, but it's not possible to query it anymore after deletion.

<Tabs groupId="languages">

<TabItem value="go" label="Go" default>

```go
package main

import (
	"context"
	"log"
	"strings"
	"time"

	immudb "github.com/codenotary/immudb/pkg/client"
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

	_, err = client.ExpirableSet(
		context.TODO(),
		[]byte("expirableKey"),
		[]byte("expirableValue"),
		time.Now(),
	)
	if err != nil {
		log.Fatal(err)
	}

	// the following will raise an error with key not found
	_, err = client.Get(
		context.TODO(),
		[]byte("expirableKey"),
	)
	if err == nil || !strings.Contains(err.Error(), "key not found") {
		log.Fatalf("expecting key not found error: %v", err)
	}
}
```
</TabItem>


<TabItem value="java" label="Java">

This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Java sdk github project](https://github.com/codenotary/immudb4j/issues/new)

</TabItem>


<TabItem value="net" label=".NET">

``` csharp

var client = new ImmuClient();
await client.Open("immudb", "immudb", "defaultdb");

await client.ExpirableSet("key1", "value1", DateTime.Now.AddDays(1));

Entry entry = await client.VerifiedGet("key1");
Console.WriteLine(entry.ToString());
await client.Close();

```

This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Java sdk github project](https://github.com/codenotary/immudb4j/issues/new)

</TabItem>


<TabItem value="python" label="Python">

```python
from immudb import ImmudbClient
from datetime import datetime, timedelta
import time

URL = "localhost:3322"  # immudb running on your machine
LOGIN = "immudb"        # Default username
PASSWORD = "immudb"     # Default password
DB = b"defaultdb"       # Default database name (must be in bytes)

def main():
    client = ImmudbClient(URL)
    client.login(LOGIN, PASSWORD, database = DB)
    client.expireableSet(b"TEST", b"test", datetime.now() + timedelta(seconds=3))
    print(client.get(b"TEST")) # b"test"
    time.sleep(4)
    try:
        print(client.get(b"TEST"))
    except:
        pass # Key not found, because it expires, raises Exception

if __name__ == "__main__":
    main()
```
</TabItem>


<TabItem value="node.js" label="Node.js">

This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Node.js sdk github project](https://github.com/codenotary/immudb-node/issues/new)

</TabItem>


<TabItem value="other" label="Others">

If you're using another development language, please refer to the <a href="/connecting/immugw">immugw</a> option.

</TabItem>


</Tabs>


