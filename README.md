# E-Boekhouden Node.JS API Client

![](assets/header.png)

Access the [E-Boekhouden](https://www.e-boekhouden.nl/) API from Node.JS. See documentation here: [https://www.e-boekhouden.nl/koppelingen/api/](https://www.e-boekhouden.nl/koppelingen/api/) (Dutch)

## DEVELOPMENT STATUS

This project is currently in development and not all methods are implemented yet. If you want to help, feel free to open a PR.

Todo:

- [ ] Method: **AddFactuur**
- [ ] Method: **AddMutatie**
- [ ] Method: AutoLogin
- [ ] Automated tests
- [ ] Further documentation, translated properly (API docs, examples, etc.)

Methods implemented:

- [x] AddGrootboekrekening
- [x] AddRelatie
- [x] CloseSession
- [x] GetAdministraties
- [x] GetArtikelen
- [x] GetFacturen
- [x] GetGrootboekrekeningen
- [x] GetKostenplaatsen
- [x] GetMutaties
- [x] GetOpenPosten
- [x] GetRelaties
- [x] GetSaldi
- [x] GetSaldo
- [x] OpenSession (unified)
- [x] OpenSessionSub (unified)
- [x] UpdateGrootboekrekening
- [x] UpdateRelatie

## Installation

```bash
npm install e-boekhouden
```

## Getting started

```typescript
import { EboekhoudenClient } from "e-boekhouden";
import type { EboekhoudenClientOptions } from "e-boekhouden";

const opts: EboekhoudenClientOptions = {
    username: "<Username>",
    code1: "<Security code 1>",
    code2: "<Security code 2>"
};

const run = async () => {
    // Create a new client instance
    const client = new EboekhoudenClient(opts);
    // Open a new session. This is required for all requests.
    await client.init();

    const administraties = await client.getAdministraties();
    console.log(administraties);

    // A good practice is to close the session when you're done.
    await client.closeSession();
};

run();
```

## API Docs

> TBD

## License

The MIT License (MIT)

Copyright © CaffCode 2023. All Rights Reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
