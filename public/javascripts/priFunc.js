//const { post } = require("../../app");

//private
window.onload = function () {
    // 현재 페이지, 게시글 목록에서 표시
    let currentPageNumber = document.getElementById("currentPageNumber").value;
    let listClass = "cp" + currentPageNumber;
    //console.log(listClass)
    let currentBoard = document.getElementById(document.getElementById("priPostSubmit").value);
    currentBoard.classList.add('current');

    let currentList = document.getElementById(listClass);
    if (currentList)
        currentList.classList.add('current');
    //let boardNum = document.getElementById("priPostSubmit").value;



    //게시글 작성 모달 열기
    const priPostBtn = document.getElementById("priPostBtn");
    if (priPostBtn) {
        priPostBtn.addEventListener("click", postModalOpen, false);
    }

    //게시글 등록
    const priPostSubmit = document.getElementById("priPostSubmit");
    if (priPostSubmit) {
        priPostSubmit.addEventListener("click", postSubmit, false);
    }

    //댓글 등록
    const commentSubmitBtn = document.getElementById("commentSubmit");
    if (commentSubmitBtn) {
        commentSubmitBtn.addEventListener("click", commentSubmit, false);
    }

    //댓글 삭제 비밀번호 입력창 열기
    const commentDel = document.getElementsByName("commentDel");
    if (commentDel) {
        for (let i = 0; i < commentDel.length; i++) {
            commentDel[i].addEventListener("click", commentPwModalOpen, false);
        }
    }

    //댓글 수정
    const commentUpdate = document.getElementsByName("commentUpdate");
    if (commentUpdate) {
        for (let i = 0; i < commentUpdate.length; i++) {
            commentUpdate[i].addEventListener("click", event => commentUpdateOpen(i), false);
        }
    }

    let commentUpdateComplete = document.getElementsByName("commentUpdateComplete");
    if (commentUpdateComplete) {
        for (let i = 0; i < commentUpdateComplete.length; i++) {
            commentUpdateComplete[i].addEventListener("click", event => upComFunc(0, i, commentUpdateComplete[i].value), false);
        }
    }

    let commentUpCancel = document.getElementsByName("commentUpCancel");
    if (commentUpCancel) {
        for (let i = 0; i < commentUpCancel.length; i++) {
            commentUpCancel[i].addEventListener("click", event => commentUpCancelFunc(i), false);
        }
    }

    //댓글 삭제
    let commentModalDelBtn = document.getElementById("commentModalDelBtn");
    if (commentModalDelBtn) {
        commentModalDelBtn.addEventListener("click", e => commentModalDel(e), false);
    }

    //게시글 삭제 비밀번호 입력창 열기
    const postDelBtn = document.getElementById("postDelBtn");
    if (postDelBtn) {
        postDelBtn.addEventListener("click", commentPwModalOpen, false);
    }

    //게시글 수정 버튼
    const postModBtn = document.getElementById("postModBtn");
    if (postModBtn) {
        postModBtn.addEventListener("click", postModModalOpen, false);
    }

    //게시글 수정 확인 버튼
    const postUpdate = document.getElementById("postUpdate");
    if (postUpdate) {
        postUpdate.addEventListener("click", e => upComFunc(1, 0, postUpdate.value), false);
    }

    // //게시글 삭제
    // let commentModalDelBtn2 = document.getElementById("");
    // if (commentModalDelBtn2) {
    //     commentModalDelBtn2.addEventListener("click", postModalDel, false);
    // }

    //페이지네이션 번호 클릭 AJAX 보류
    // let listNumBtn = document.getElementsByName("listNum");
    // //let listNumBtn = document.getElementsByClassName("listNum1");
    // if (listNumBtn) {
    //     for (let i = 0; i < listNumBtn.length; i++) {
    //         listNumBtn[i].addEventListener("click", listNumPagination, false);
    //     }
    // }
}

// function listNumPagination() {
//     console.log("come")
//     let xhr = new XMLHttpRequest();

//     let value = this.value;
//     console.log(value);
//     let url = document.getElementById("priPostSubmit").value;
//     console.log(url);

//     let data = { 'value': value };
//     data = JSON.stringify(data);
//     console.log(data);

//     xhr.onload = function () {
//         if (xhr.status === 200 || xhr.status === 201) {
//             //console.log(xhr.responseText);
//         } else if (500) {
//             //console.error(xhr.responseText);
//             //window.location.reload();
//         } else {
//             // window.location.reload();
//         }
//     };
//     xhr.open("post", "/private/board/" + url + "/list", true);
//     xhr.setRequestHeader("Content-Type", "application/json");  // 컨텐츠타입을 json으로
//     xhr.send(data);
// }

// 게시글 등록과 같은 모달이지만 내용 다르게 오픈
function postModModalOpen() {
    $('body').css("overflow", "hidden");

    let postModal = document.getElementById("postModal");
    let span = document.getElementById("postClose");
    let postPw = document.getElementById("postPw");
    let postTitle = document.getElementById("postTitle0").innerText;
    let postCotent = document.getElementById("postCotent0").innerHTML;
    console.log(postCotent)

    let postModalTitle = document.getElementById("postTitle");
    let postUpdate = document.getElementById("postUpdate");
    let priPostSubmit = document.getElementById("priPostSubmit");

    //모달에 게시글 내용 표시
    postModalTitle.value = postTitle;
    CKEDITOR.instances['p_content'].setData(postCotent);
    postUpdate.removeAttribute('hidden');
    priPostSubmit.style.display = "none";
    //게시글 작성 모달 오픈
    postModal.style.display = "block";
    document.getElementById("postTitle").focus();
    // When the user clicks on <span> (x), close the modal
    if (span) {
        span.addEventListener("click", function () {
            postModal.style.display = "none";
            $('body').css("overflow", "scroll");
            postModalTitle.value = "";
            postPw.value = "";
            CKEDITOR.instances['p_content'].setData("");
            postUpdate.setAttribute('hidden', 'true');
            priPostSubmit.style.display = "block";
        }, false);
    }

    // 모달 영역 밖 선택 시 창 닫기
    window.addEventListener("click", function () {
        if (event.target == postModal) {
            postModal.style.display = "none";
            $('body').css("overflow", "scroll");
            postModalTitle.value = "";
            postPw.value = "";
            CKEDITOR.instances['p_content'].setData("");
            postUpdate.setAttribute('hidden', 'true');
            priPostSubmit.style.display = "block";
        }
    }, false);
}

function commentUpdateOpen(i1) {
    //길이 제한 추가
    let i = i1;
    let upPw = document.getElementsByName("commentUpdatePw");
    let up = document.getElementsByName("commentUpdate");
    let upCom = document.getElementsByName("commentUpdateComplete");
    let upDel = document.getElementsByName("commentDel");
    let upId = document.getElementsByName("commentId");
    let upContent = document.getElementsByName("commentContent");
    let commentUpCancel = document.getElementsByName("commentUpCancel");

    upId[i].setAttribute('contenteditable', "true");
    upId[i].classList.add("border", "mb-2", "p-2")
    upContent[i].setAttribute('contenteditable', "true");
    upContent[i].classList.add("border", "mt-3", "p-2", "d-block")

    upPw[i].removeAttribute('hidden');
    upCom[i].removeAttribute('hidden');
    commentUpCancel[i].removeAttribute('hidden');

    up[i].style.display = "none";
    upDel[i].style.display = "none";
}

// 댓글 수정 취소
function commentUpCancelFunc(i) {
    let upPw = document.getElementsByName("commentUpdatePw");
    let up = document.getElementsByName("commentUpdate");
    let upCom = document.getElementsByName("commentUpdateComplete");
    let upDel = document.getElementsByName("commentDel");
    let upId = document.getElementsByName("commentId");
    let upContent = document.getElementsByName("commentContent");
    let commentUpCancel = document.getElementsByName("commentUpCancel");
    let comUpPw = document.getElementsByName("commentUpdatePw");

    upId[i].setAttribute('contenteditable', "false");
    upId[i].classList.remove("border", "mb-2", "p-2")
    upContent[i].setAttribute('contenteditable', "false");
    upContent[i].classList.remove("border", "mt-3", "p-2", "d-block")

    upPw[i].setAttribute('hidden', "true");
    upCom[i].setAttribute('hidden', "true");
    commentUpCancel[i].setAttribute('hidden', "true");

    up[i].style.display = "inline";
    upDel[i].style.display = "inline";
    comUpPw[i].value = "";
}
//댓글, 게시글 수정 op로 구별, i: 몇번째 버튼, valu: url
function upComFunc(op, i, val) {
    let data;
    let input
    let xhr = new XMLHttpRequest();
    let url = val;

    if (op === 0) {
        // let upPw = document.getElementsByName("commentUpdatePw");
        let comUpPw = document.getElementsByName("commentUpdatePw");
        let upId = document.getElementsByName("commentId");
        let upContent = document.getElementsByName("commentContent");

        data = { 'pw': comUpPw[i].value, 'id': upId[i].innerText, 'content': upContent[i].innerHTML };
        input = comUpPw[i];

    } else {
        let content = CKEDITOR.instances['p_content'].getData();
        let postModalTitle = document.getElementById("postTitle");
        input = document.getElementById("postPw");

        data = { 'pw': input.value, 'id': postModalTitle.value, 'content': content };
    }

    console.log(url)
    let title = data.id;
    let content = data.content;
    data = JSON.stringify(data);
    console.log(data);

    xhr.onload = function () {
        if (xhr.status === 200 || xhr.status === 201) {
            //console.log(xhr.responseText);
            alert("수정 완료!");
            if (op === 0) { //댓글 수정일 때
                let upPw = document.getElementsByName("commentUpdatePw");
                let up = document.getElementsByName("commentUpdate");
                let upCom = document.getElementsByName("commentUpdateComplete");
                let upDel = document.getElementsByName("commentDel");
                let upId = document.getElementsByName("commentId");
                let upContent = document.getElementsByName("commentContent");
                let commentUpCancel = document.getElementsByName("commentUpCancel");

                upId[i].setAttribute('contenteditable', "false");
                upId[i].classList.remove("border", "mb-2", "p-2")
                upContent[i].setAttribute('contenteditable', "false");
                upContent[i].classList.remove("border", "mt-3", "p-2", "d-block")

                upPw[i].setAttribute('hidden', "true");
                upCom[i].setAttribute('hidden', "true");
                commentUpCancel[i].setAttribute('hidden', "true");

                up[i].style.display = "inline";
                upDel[i].style.display = "inline";
                input.value = "";
            } else { // 게시글 수정일 때
                document.getElementById("postTitle0").innerText = title;
                document.getElementById("postCotent0").innerHTML = content;

                let postModalTitle = document.getElementById("postTitle");
                let postUpdate = document.getElementById("postUpdate");
                let priPostSubmit = document.getElementById("priPostSubmit");

                postModal.style.display = "none";
                $('body').css("overflow", "scroll");
                postModalTitle = "";
                input.value = "";
                CKEDITOR.instances['p_content'].setData("");
                postUpdate.setAttribute('hidden', 'true');
                priPostSubmit.style.display = "block";
            }
        } else if (509) {
            alert("비밀번호를 확인하세요.");
            input.value = "";
        } else {
            alert("삭제 오류!");
            window.location.reload();
        }
    };
    //코멘트 아이디랑 보드넘버bn id / comment1/12
    xhr.open("POST", "/private/update/" + url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(data);
}

//댓글 삭제 비밀번호 입력창
function commentPwModalOpen() {
    let value = this.value; // 삭제 아이콘의 값 가져옴
    console.log(value);
    $(document).off('focusin.modal'); //삭제 모달 오픈 시 텍스트 선택 불가 해결 - 모달에 포커스가 있어서

    let span = document.getElementById("commentClose");

    //비밀번호 입력창 오픈
    let commentDelModal = document.getElementById("commentDelModal");
    commentDelModal.style.display = "block";
    document.getElementById("commentDelPw").focus();
    document.getElementById("commentModalDelBtn").value = value;

    // When the user clicks on <span> (x), close the modal
    if (span) {
        span.addEventListener("click", function () {
            commentDelModal.style.display = "none";
            let input = document.getElementById("commentDelPw");
            input.value = "";
        }, false);
    }

    // 모달 영역 밖 선택 시 창 닫기
    window.addEventListener("click", function () {
        if (event.target == commentDelModal) {
            commentDelModal.style.display = "none";

            let fm = document.getElementById("commentDelForm");
            //console.log("reset!")
            fm.reset();
            $('#commentPw').removeAttr("disabled");
        }
    }, false);
}

// 댓글 삭제
function commentModalDel(e) {
    e.preventDefault();
    let xhr = new XMLHttpRequest();
    let commentDelPw = document.getElementById("commentDelPw").value;
    let value = document.getElementById("commentModalDelBtn").value;
    let commentDelModal = document.getElementById("commentDelModal");

    let div = value; //삭제할 댓글 div
    let commentDiv = document.getElementById(div); //삭제할 댓글 div
    let data = { 'pw': commentDelPw };
    data = JSON.stringify(data);
    //console.log("비밀번호: " + data);

    xhr.onload = function () {
        let input = document.getElementById("commentDelPw");
        input.value = "";
        if (xhr.status === 200 || xhr.status === 201) {
            //console.log(xhr.responseText);
            alert("삭제 완료!");
            if (commentDiv)
                commentDiv.parentNode.removeChild(commentDiv);
            commentDelModal.style.display = "none";
            if (value.indexOf("board") !== -1) // 게시글 삭제일 경우 새로고침
                window.location.href = '/private';
            //window.location.reload();
        } else if (500) {
            alert("비밀번호를 확인하세요.");
        } else {
            alert("삭제 오류!");
            window.location.reload();
        }
    };
    xhr.open("POST", "/private/delete/" + value);
    xhr.setRequestHeader("Content-Type", "application/json"); // 컨텐츠타입을 json으로
    xhr.send(data);
    //console.log(guestPw.value);
}

//게시글 작성 모달 오픈
function postModalOpen() {
    $('body').css("overflow", "hidden");

    let postModal = document.getElementById("postModal");
    // let guestModalId = document.getElementById("guestModalId");
    let span = document.getElementById("postClose");
    // let postModalBtn = document.getElementById("postModalBtn");
    //let modal = document.getElementById("modal-window-4");

    //게시글 작성 모달 오픈
    //location.href = '#guestDelModal'
    postModal.style.display = "block";
    document.getElementById("postTitle").focus();
    // guestModalId.value = value;

    // When the user clicks on <span> (x), close the modal
    if (span) {
        span.addEventListener("click", function () {
            postModal.style.display = "none";
            $('body').css("overflow", "scroll");
        }, false);
    }

    // 모달 영역 밖 선택 시 창 닫기
    window.addEventListener("click", function () {
        if (event.target == postModal) {
            postModal.style.display = "none";
            $('body').css("overflow", "scroll");
        }
    }, false);
}

//게시글 전송
function postSubmit() {

    let xhr = new XMLHttpRequest();
    let title = document.getElementById("postTitle").value;
    let content = CKEDITOR.instances.p_content.getData();
    let boardNum = this.value;
    let postPw = document.getElementById("postPw").value;

    let data = { title: title, content: content, pw: postPw };
    data = JSON.stringify(data);
    console.log(data);

    xhr.onload = function () {
        if (xhr.status === 200 || xhr.status === 201) {
            //console.log(xhr.responseText);
            alert("게시글 작성 완료!");
            let postModal = document.getElementById("postModal");
            postModal.style.display = "none";
            $('body').css("overflow", "scroll");
        } else if (500) {
            //console.error(xhr.responseText);
            console.log("오잉?")
            alert("비밀번호를 확인하세요.");
        } else {
            alert("게시글 작성 오류!");
        }
    }

    xhr.open('post', '/private/write/' + boardNum);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(data);
}

//댓글 전송
function commentSubmit() {

    let xhr = new XMLHttpRequest();

    let name = document.getElementById("commentName").value;
    let content = document.getElementById("commentSubmitContent").value;
    let pw = document.getElementById("commentPw").value;
    let num = this.value;
    console.log(num);

    let data = { name: name, content: content, pw: pw };
    data = JSON.stringify(data);
    console.log(data);

    xhr.onload = function () {
        if (xhr.status === 200 || xhr.status === 201) {
            //console.log(xhr.responseText);
            alert("댓글 작성 완료!");
            window.location.reload();
        } else {
            alert("댓글 작성 오류!");
            window.location.reload();
        }
    }

    xhr.open('post', '/private/write/' + num);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(data);
}

// $("a").click(function () {
//     $(".current").removeClass("current");
//     //return false;
// });

//게시글 작성 버튼들
CKEDITOR.replace('p_content'
    , {
        height: 450,

    });
