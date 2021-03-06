const rowTypes = require('./../config/row_types');

/** Lookup a channel invoice.

  {
    lnd_grpc_api: <Object>
    id: <RHash Identification String>
  }

  @returns via cbk
  {
    memo: <Description String>
    payment_request: <Payment Request String>
    settled: <Finalized Bool>
    type: <Type String>
  }
*/
module.exports = (args, cbk) => {
  if (!args.lnd_grpc_api || !args.id) {
    return cbk([500, 'Missing lnd grpc api or id', args]);
  }

  return args.lnd_grpc_api.lookupInvoice({
    r_hash_str: args.id,
  },
  (err, response) => {
    if (!!err) {
      return cbk([500, 'Lookup invoice error', err]);
    }

    if (response.memo === undefined) {
      return cbk([500, 'Missing memo', response]);
    }

    if (response.settled === undefined) {
      return cbk([500, 'Missing settled', response]);
    }

    return cbk(null, {
      memo: response.memo,
      payment_request: response.payment_request,
      settled: response.settled,
      type: rowTypes.channel_transaction,
    });
  });
};

