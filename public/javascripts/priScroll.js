function getPageId(n) {
    return 'postpage' + n;
}

// function getDocumentHeight() {
//     const body = document.body;
//     const html = document.documentElement;

//     return Math.max(
//         body.scrollHeight, body.offsetHeight,
//         html.clientHeight, html.scrollHeight, html.offsetHeight
//     );
// };

// function getScrollTop() {
//     return (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
// }

// function getArticleImage() {
//     const hash = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
//     const image = new Image;
//     image.className = 'article-list__item__image article-list__item__image--loading';
//     image.src = 'http://api.adorable.io/avatars/250/' + hash;

//     image.onload = function () {
//         image.classList.remove('article-list__item__image--loading');
//     };
//     return image;
// }

// function getArticle() {
//     const articleImage = getArticleImage();
//     const article = document.createElement('article');
//     article.className = 'article-list__item';
//     article.appendChild(articleImage);

//     return article;
// }

// function getArticlePage(page, articlesPerPage = 16) {
//     const pageElement = document.createElement('div');
//     pageElement.id = getPageId(page);
//     pageElement.className = 'article-list__page';

//     while (articlesPerPage--) {
//         pageElement.appendChild(getArticle());
//     }

//     return pageElement;
// }

function addPaginationPage(page) {
    const pageLink = document.createElement('a');
    pageLink.href = '#' + getPageId(page);
    pageLink.innerHTML = page;

    const listItem = document.createElement('li');
    listItem.className = 'article-list__pagination__item';
    listItem.appendChild(pageLink);

    articleListPagination.appendChild(listItem);

    if (page === 1) {
        articleListPagination.classList.remove('article-list__pagination--inactive');
    }
}

function fetchPage(page) {
    articleList.appendChild(getArticlePage(page));
}

function addPage(page) {
    //  fetchPage(page);
    addPaginationPage(page);
}

// const articleList = document.getElementById('article-list');
// const articleListPagination = document.getElementById('article-list-pagination');
// let page = 0;

// addPage(++page);

// window.onscroll = function () {
//     if (getScrollTop() < getDocumentHeight() - window.innerHeight) return;
//     addPage(++page);
// };
let bool_sw = true;
let boardNum = document.getElementById('priPostSubmit');
let i = 2;
const articleListPagination = document.getElementById('article-list-pagination');
let page = 0;
window.onscroll = function () {
    if (boardNum.value == 3) {
        var height = Math.max(document.body.scrollHeight, document.body.offsetHeight,
            document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight
        );

        //console.log(window.innerHeight + " / " + window.scrollY + " / " + height)
        if ((window.innerHeight + window.scrollY) >= height - 2) {

            console.log("you're at the bottom of the page");

            let xhr = new XMLHttpRequest();
            xhr.onload = function () {
                if (xhr.status === 200) {
                    let val = JSON.parse(xhr.responseText);
                    let post = val.post3;
                    let comment = val.comment3;
                    console.log(comment);
                    let comment1 = [];
                    let comment2 = [];
                    let comment3 = [];
                    comment.forEach(e => {
                        if (e.boardid == post[0].id) {
                            comment1.push(e);
                        } else if (e.boradid == post[1].id) {
                            comment2.push(e);
                        } else {
                            comment3.push(e);
                        }
                    });
                    console.log(comment1);
                    console.log(post);
                    console.log(comment3);
                    appenPost3(post[0], comment1, true);
                    appenPost3(post[1], comment2, false);
                    appenPost3(post[2], comment3, false);
                    bool_sw = true;
                    i = i + 3;

                } else if (xhr.status === 404) {
                    console.log("마지막 페이지 입니다.");
                    // 마지막에 푸터 추가
                }
                else {
                    console.log(0);
                }
            }
            xhr.open('get', '/private/board/3/1/' + i);
            xhr.setRequestHeader('content-type', 'application/json');
            if (bool_sw === true) {
                bool_sw = false;
                addPaginationPage(++page);
                console.log(i)
                xhr.send();
            }
        }
    }
};

function appenPost3(post, comment, id) {

    if (post == null) {
        console.log("마지막")
        return
    }
    let postDiv = document.getElementById('postDiv');
    let commentStr = "";
    for (let i = 0; i < comment.length; i++) {
        commentStr += '<div id="comment3/' + comment[i].id + '">'
            + '<form>'
            + '<div class="media mb-4">'
            + '<div class="media-body">'
            + '<div class="mb-1">'
            + ' <span id="commentId" name="commentId">'
            + '  <h5 class="mt-0 d-inline">' + comment[i].title + '</h5>'
            + ' </span>'
            + ' <span class="float-right small text-gray">'
            + comment[i].date
            + ' </span>'
            + '</div>'
            + '<span id="commentContent" name="commentContent">'
            + comment[i].content
            + '</span>'
            + '<span class="float-right small text-gray">'
            + '<button class="btn2 ml-2 commentUpdate" value="comment3/' + comment[i].id + '" type="button" name="commentUpdate"><i class="fas fa-pen"></i></button>'
            + ' <button class="btn2 ml-2 commentDel" value="comment3/' + comment[i].id + '" type="button" name="commentDel"><i class="fas fa-trash-alt"></i></button>'
            + '</span>'
            + '<div class="card-group mt-3">'
            + '<input type="password" name="commentUpdatePw" class="" hidden autocomplete="on" placeholder="Password">'
            + '<button class="btn2 ml-2 border-dark" hidden type="button" value="comment3/' + comment[i].id + '" name="commentUpdateComplete">완료</button>'
            + '<button class="btn2 ml-2" hidden value="comment3/' + comment[i].id + '" type="button" name = "commentUpCancel" > <i class="fas fa-times" id="commentUpClose"></i></button>'
            + '</div>'
            + '</div>'
            + ' </div>'
            + '</form>'
            + '<hr>'
            + '</div>';
    }


    ;
    var el = document.createElement("div")
    el.id = "page" + i;
    //el.classList
    let page2;
    let hr;
    if (id) {
        page2 = page + 1;
        hr = "Page. " + page2;
    } else {
        page2 = "sub" + page + 1;
        hr = "";
    }
    el.innerHTML = hr + `
    <div id="postpage`+ page2 + `">
    <div>
        <h1 class="mt-4" id="postTitle0">`+ post.title + `</h1>
        <hr>
      </div>

      <!-- Author -->
      <!-- <p class="lead">
          by
          <a href="#">Start Bootstrap</a>
        </p> -->

      <!-- Date/Time -->
      <div class="text-right m-2 text-gray">
        <p>`+ post.date + `</p>
      </div>
      <hr>

      <!-- Post Content -->
      <!-- class for iframe responsive -->
      <div class="embed-responsive" id="postCotent0">
      `+ post.content + `
      </div>

      <br>
      <hr>

      <!-- 댓글 -->
      <!-- Single Comment -->
      <div id="comment">`

        +
        commentStr
        +

        `<!-- Comments Form -->
        <div class="card my-4">
                <h5 class="card-header">Leave a Comment:</h5>
                <form>
                    <div class="card-body">
                        <div class="form-group" id="contentdiv">
                            <textarea class="form-control" rows="2" id="commentSubmitContent"></textarea>
                        </div>
                        <input type="text" class="form-control col-3 d-inline" placeholder="Name" id="commentName">
                            <input type="password" class="form-control col-3 d-inline" placeholder="Password" id="commentPw"
                                type="button" autocomplete="on">
                                <button class="btn btn-primary float-right commentSubmit" id="commentSubmit" type="button"
                                    value="3/` + post.id + `">Submit</button>
            </div>
          </form>
        </div>
        </div>
        </div>
        </div>
    `;

    postDiv.appendChild(el);
}