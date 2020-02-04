exports.formatDates = list => {
  //changing the format of created_at key to be sql compatable
  if (list.length === 0) return [];

  let newList = [];

  list.forEach(item => {
    let newItem = { ...item };
    newItem.created_at = new Date(item.created_at);
    newList.push(newItem);
  });

  return newList;
};

exports.makeRefObj = list => {
  let refObj = {};
  list.forEach(item => {
    refObj[item.title] = item.article_id;
  });

  return refObj;
};

exports.formatComments = (comments, articleRef) => {
  let newComments = [];
  
  comments.forEach(comment => {
    let newComment = { ...comment };
    //change created_by key to author key
    newComment.author = comment.created_by;
    delete newComment.created_by;
    //change belongs_to and article title to article_id key-value
    newComment.article_id = articleRef[newComment.belongs_to];
    delete newComment.belongs_to;
    newComments.push(newComment);
  });

  return newComments;
};
