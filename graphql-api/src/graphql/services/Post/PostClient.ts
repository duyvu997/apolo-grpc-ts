import fs from 'fs';
import * as grpc from 'grpc';
import * as protoLoader from '@grpc/proto-loader';

const packageDefinition:any = protoLoader.loadSync(__dirname + '/post.proto');

const proto:any = grpc.loadPackageDefinition(packageDefinition).sample;

const credentials:any = grpc.credentials.createInsecure()

const interceptorAuth:any = (options:any, nextCall:any) =>
  new grpc.InterceptingCall(nextCall(options), {
    start: function(metadata, listener, next) {
      metadata.add('x-api-key', 'myapikey');
      next(metadata, listener);
    }
  });

const options:any = {
  'grpc.ssl_target_name_override': 'localhost',
  interceptors: [interceptorAuth]
};

export default () => new proto.PostService('localhost:50051', credentials, options);
