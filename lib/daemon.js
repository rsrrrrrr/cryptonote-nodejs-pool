var _0x26c4=['daemon','wallet','api','toString','repeat','stringify','getlastblockheader','2.0','mergedMining','poolServer','poolAddress','jsonHttpRequest','port','error','%s\x20error\x20from\x20daemon','coin','result','status','hasOwnProperty','block_header','hash','%s\x20found\x20new\x20hash\x20%s','host','Error\x20polling\x20getblocktemplate\x20%j','send','blockRefreshInterval','./utils.js','./apiInterfaces.js'];(function(_0x3f2edb,_0x5e31e3){var _0x598473=function(_0x4407d8){while(--_0x4407d8){_0x3f2edb['push'](_0x3f2edb['shift']());}};_0x598473(++_0x5e31e3);}(_0x26c4,0x14e));var _0x54a5=function(_0x5e7bdc,_0x524b75){_0x5e7bdc=_0x5e7bdc-0x0;var _0x55118e=_0x26c4[_0x5e7bdc];return _0x55118e;};let utils=require(_0x54a5('0x0'));let async=require('async');let apiInterfaces=require(_0x54a5('0x1'))(config[_0x54a5('0x2')],config[_0x54a5('0x3')],config[_0x54a5('0x4')]);let lastHash;let POOL_NONCE_SIZE=0x10+0x1;let EXTRA_NONCE_TEMPLATE='02'+POOL_NONCE_SIZE[_0x54a5('0x5')](0x10)+'00'[_0x54a5('0x6')](POOL_NONCE_SIZE);let POOL_NONCE_MM_SIZE=POOL_NONCE_SIZE+utils['cnUtil']['get_merged_mining_nonce_size']();let EXTRA_NONCE_NO_CHILD_TEMPLATE='02'+POOL_NONCE_MM_SIZE[_0x54a5('0x5')](0x10)+'00'['repeat'](POOL_NONCE_MM_SIZE);let logSystem=_0x54a5('0x2');let blockData=JSON[_0x54a5('0x7')]({'id':'0','jsonrpc':'2.0','method':_0x54a5('0x8'),'params':{}});let templateData=JSON['stringify']({'id':'0','jsonrpc':_0x54a5('0x9'),'method':'getblocktemplate','params':{'reserve_size':config['poolServer'][_0x54a5('0xa')]?POOL_NONCE_MM_SIZE:POOL_NONCE_SIZE,'wallet_address':config[_0x54a5('0xb')][_0x54a5('0xc')]}});require('./exceptionWriter.js')(logSystem);function runInterval(){async['waterfall']([function(_0x2e3bbd){apiInterfaces[_0x54a5('0xd')](config[_0x54a5('0x2')]['host'],config[_0x54a5('0x2')][_0x54a5('0xe')],blockData,function(_0x45ad78,_0x48265a){if(_0x45ad78){log(_0x54a5('0xf'),logSystem,_0x54a5('0x10'),[pool[_0x54a5('0x11')]]);setTimeout(runInterval,0xbb8);return;}if(_0x48265a&&_0x48265a['result']&&_0x48265a[_0x54a5('0x12')][_0x54a5('0x13')]==='OK'&&_0x48265a[_0x54a5('0x12')][_0x54a5('0x14')](_0x54a5('0x15'))){let _0x1ffcb0=_0x48265a[_0x54a5('0x12')][_0x54a5('0x15')][_0x54a5('0x16')]['toString']('hex');if(!lastHash||lastHash!==_0x1ffcb0){lastHash=_0x1ffcb0;log('info',logSystem,_0x54a5('0x17'),[config[_0x54a5('0x11')],_0x1ffcb0]);_0x2e3bbd(null,!![]);return;}else{_0x2e3bbd(!![]);return;}}else{log(_0x54a5('0xf'),logSystem,'bad\x20reponse\x20from\x20daemon');setTimeout(runInterval,0xbb8);return;}});},function(_0x140a70,_0x17d890){apiInterfaces[_0x54a5('0xd')](config['daemon'][_0x54a5('0x18')],config[_0x54a5('0x2')][_0x54a5('0xe')],templateData,function(_0xdbea2c,_0x1d5780){if(_0xdbea2c){log(_0x54a5('0xf'),logSystem,_0x54a5('0x19'),[_0xdbea2c]);_0x17d890(null);return;}process[_0x54a5('0x1a')]({'type':'BlockTemplate','block':_0x1d5780[_0x54a5('0x12')]});_0x17d890(null);});}],function(_0x3adea4){if(_0x3adea4){}setTimeout(function(){runInterval();},config[_0x54a5('0xb')][_0x54a5('0x1b')]);});}runInterval();