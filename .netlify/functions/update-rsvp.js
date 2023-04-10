const faunadb = require('faunadb');
exports.handler = async (event, context) => {
  const q = faunadb.query;
  const client = new faunadb.Client({
    secret: process.env.FAUNA_SECRET_KEY,
  });

  const eventBody = JSON.parse(event.body);

  if (!eventBody.code) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'There\'s a problem with your RSVP.',
      }),
    };
  }

  const doesDocExist = await client.query(
    q.Exists(q.Match(q.Index('guest_by_code'), eventBody.code))
  );

  if (!doesDocExist) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'There\'s a problem with your RSVP.',
      }),
    };
  }

  const document = await client.query(
    q.Get(q.Match(q.Index('guest_by_code'), eventBody.code))
  );

  // add 'simple' form data to the object we'll use to update the document
  var newDocumentData = {
    isGoing: (eventBody.isGoing == 'on' ? true : false),
    arrivalDate: eventBody.arrivalDate,
    stayLocation: eventBody.stayLocation,
    mailingAddress: eventBody.mailingAddress,
    song: eventBody.song,
    entrees_1 : eventBody.entrees_1
  }

  // add entree and guest name info
  for (let i = 0; i < document.data.maxGuests; ++i) {
    let nameKey = "guest_" + (i+2)
    let entreeKey = "entrees_" + (i+2)
    newDocumentData[nameKey] = eventBody[nameKey]
    newDocumentData[entreeKey] = eventBody[entreeKey]
  }

  await client.query(
    q.Update(document.ref, {
      data: newDocumentData,
    })
  );

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "✔️ Your RSVP was updated!"
    }),
  };
};