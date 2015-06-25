// Seed DB if empty with lists


//
////
Meteor.startup(function () {
  console.log('startup....');

  if (Lists.find().count() <= 1) {
    for (var i = 0; i < 10; i++) {
      Lists.insert({
        title: 'Example',
        body: 'This is an example',
        userId: 'LvDvPTaBFfPt74Pm8',
        createdAt: new Date(),
        author: 'Bruce',
        postIds: ['Rty6gSjtK8D6ipnEN', '52jN7ApyMoZ6eCgvn', 'kozmXMQkTc6Zo5CEX'],
        upvotes: 0,
        downvotes: 0,
        commentCount: 0,
        clickCount: 0,
        viewCount: 0,
        baseScore: 0,
        score: 0,
        inactive: false,
        sticky: false,
        posts: []
      });
    }
  }
  console.log('Lists :', Lists.find().count());
});