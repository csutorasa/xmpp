import { TcpServer } from "./tcp/TcpServer";
import { StreamHandler } from "./stream/StreamHandler";

const server = new TcpServer()

server
.addHandler(new StreamHandler())

//server.start();

import { XMLWriter } from "../library";

console.log(XMLWriter.create(true).attr('asd', '123').attr('asdsd', '321').xmlns('demo', 'http://demo.com')
.element('data', XMLWriter.create().element('inner', XMLWriter.create().text('asd'))).toXML());
