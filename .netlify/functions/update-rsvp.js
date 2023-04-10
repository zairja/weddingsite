const faunadb = require('faunadb');
exports.handler = async (event, context) => {
  const q = faunadb.query;
  const client = new faunadb.Client({
    secret: process.env.FAUNA_SECRET_KEY,
  });

  console.log(event.body);

  const eventBody = JSON.parse(event.body);

  console.log(eventBody)

  const code = eventBody.code;

  console.log(code)

  if (!code) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Please provide a code.',
      }),
    };
  }

  const doesDocExist = await client.query(
    q.Exists(q.Match(q.Index('guest_by_code'), code))
  );

  if (!doesDocExist) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'That code is wrong.',
      }),
    };
  }

  // update here (do q.update)

  const document = await client.query(
    q.Get(q.Match(q.Index('guest_by_code'), code))
  );

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Your RSVP was updated!"
    }),
  };
};