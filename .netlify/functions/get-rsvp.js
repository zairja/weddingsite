const faunadb = require('faunadb');
exports.handler = async (event) => {
  const q = faunadb.query;
  const client = new faunadb.Client({
    secret: process.env.FAUNA_SECRET_KEY,
  });

  const { code } = event.queryStringParameters;
  if (!code) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: '❌ Please provide a code.',
      }),
    };
  }

  const doesDocExist = await client.query(
    q.Exists(q.Match(q.Index('guest_by_code'), code.toLowerCase()))
  );

  if (!doesDocExist) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: '❌ That code is wrong.',
      }),
    };
  }

  const document = await client.query(
    q.Get(q.Match(q.Index('guest_by_code'), code.toLowerCase()))
  );

  return {
    statusCode: 200,
    body: JSON.stringify(document.data),
  };
};