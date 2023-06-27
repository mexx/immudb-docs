# Welcome

<p>
    <a href="https://immudb.io/">
        <img src="https://docs.immudb.io/mascot.png" alt="immudb logo" width=200>
    </a>
</p>

<h1>Welcome to the immudb docs</h1>  
    
<p>
    <a href="https://immudb.io/">immudb</a> - world’s fastest immutable database. immudb's documentation is built with Docusaurus.
    <br><br/>
    <a href="https://immudb.io/">Homepage</a>
    ·
    <!-- #FIXME update with the most recent link -->
    <a href="https://docs.immudb.io/">Documentation</a>
    ·
    <a href="https://github.com/codenotary/immudb/issues">Issue Tracker</a>
</p>

Great to see you here!

immudb is a database written in Go, but unlike other databases, it is immutable: history is preserved and can't be changed without clients noticing.

immudb can be used both as a key-value store, or as a relational database (SQL).

immudb can be run as full database server with replicas or easily embedded as a lightweight database into application.

<br><br/>

## Running documentation locally  


1. Install dependencies
```
$ yarn
```

1. From the root directory, 
```
$ yarn start
```


This command starts a local development server and opens up [http://localhost:3000](http://localhost:3000). Most changes are reflected live without having to restart the server.`


## Indexing to algolia

From the root directory, enter `npm run algolia:index`.
> Not up to date with latest changes

## Copyright and license

Homepage and documentation copyright 2017-2023 [Immudb Authors](https://github.com/codenotary/immudb/graphs/contributors). 
Docs released under [Creative Commons](https://github.com/codenotary/immudb.io/blob/master/LICENSE).