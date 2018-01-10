const showComments=function () {
  let commentSection=document.getElementById('commentSection');
  let commentsTable="<table><th>DATE</th><th>NAME</th><th>COMMENT</th>";
  let tableContentHtml=comments.map(function (element) {
    return `<tr><td>${element.time}</td><td>${element.name}</td><td>${element.comment}</td></tr>`;
  }).join('');
  commentsTable+=`${tableContentHtml}</table></hr>`;
  commentSection.innerHTML=commentsTable;
};

window.onload=showComments;
