// Seed DB if empty with lists


//
////
Meteor.startup(function () {
  console.log('startup....');
  console.log(Lists);

  console.log('Lists.find().count(): ', Lists.find().count());

  if (Lists.find().count() <= 1) {
    for (var i = 0; i < 10; i++) {
      Lists.insert({
        title: 'Example',
        body: 'This is an example',
        userId: 'LvDvPTaBFfPt74Pm8',
        createdAt: new Date(),
        author: 'Bruce',
        posts: ['Rty6gSjtK8D6ipnEN', '52jN7ApyMoZ6eCgvn', 'kozmXMQkTc6Zo5CEX']
      });
    }
  }
  console.log('Lists :', Lists.find().count());
});