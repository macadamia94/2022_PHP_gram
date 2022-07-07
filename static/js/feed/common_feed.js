//feed 가져오는 부분
const feedObj = {
  // 멤버 필드
  limit: 10,
  itemLength: 0,
  currentPage: 1,
  swiper: null,
  getFeedUrl: '',
  iuser: 0,

  // 멤버 메소드
  //인피니티 스크롤
  setScrollInfinity: function () {
    window.addEventListener('scroll', e => {
      if (this.isLoading()) { return; }

      //따로 적은거랑 똑같음 (구조분해 할당, js만 됨), 주의점 : 멤버필드 이름이랑 똑같이 해야함
      const {
        scrollTop,
        scrollHeight,
        clientHeight
      } = document.documentElement;

      if (scrollTop + clientHeight >= scrollHeight - 10 && this.itemLength === this.limit) {
        this.getFeedList();
      }

    }, { passive: true });
  },

  //list 가져오는 통신 부분
  getFeedList: function () {
    this.itemLength = 0;
    this.showLoading();
    const param = {
      page: this.currentPage++,
      iuser: this.iuser
    }
    fetch(this.getFeedUrl + encodeQueryString(param))
      .then(res => res.json())
      .then(list => {
        this.itemLength = list.length;
        this.makeFeedList(list);
      })
      .catch(e => {
        console.error(e);
        this.hideLoading();
      });
  },

  //이미지 스와이프 화살표 함수
  refreshSwipe: function () {
    if (this.swiper !== null) { this.swiper = null; }
    this.swiper = new Swiper('.swiper', {
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      pagination: { el: '.swiper-pagination' },
      allowTouchMove: false,
      direction: 'horizontal',
      loop: false
    });
  },

  loadingElem: document.querySelector('.loading'),
  containerElem: document.querySelector('#item_container'),

  //댓글 리스트 함수화
  getFeedCmtList: function (ifeed, divCmtList, spanMoreCmt) {
    fetch(`/feedcmt/index?ifeed=${ifeed}`)
    .then(res => res.json())
    .then(res => {
      if (res && res.length > 0) {
        if (spanMoreCmt) { spanMoreCmt.remove(); }
        divCmtList.innerHTML = null;
        res.forEach(item => {
          const divCmtItem = this.makeCmtItem(item);
          divCmtList.appendChild(divCmtItem);
        });
      }
    });
  },

  //댓글 만드는 부분
  makeCmtItem: function (item) {
    const divCmtItemContainer = document.createElement('div');
    divCmtItemContainer.className = 'd-flex flex-row align-items-center ps-3 pt-2';
    const src = '/static/img/profile/' + (item.writerimg ? `${item.iuser}/${item.writerimg}` : 'defaultProfileImg_100.png');
    divCmtItemContainer.innerHTML = `
          <div class="circleimg h30 w30">
              <img src="${src}" class="profile w24 pointer cmtFeedWinList profileimg" id="cmtProfileimg" data-iuser="${item.iuser}">                
          </div>
          <div class="d-flex flex-row align-items-center">
              <div class="pointer bold spanNick ms-1 me-2 cmtFeedWinList">${item.writer}</div>
              <div>${item.cmt}</div>
              <div class="reg_date ms-2">${getDateTimeInfo(item.regdt)}</div>
          </div>
      `;

    const cmtFeedWinList = divCmtItemContainer.querySelectorAll('.cmtFeedWinList');
    cmtFeedWinList.forEach(el => {
      el.addEventListener('click', () => {
        moveToFeedWin(item.iuser);
      });
    });

    return divCmtItemContainer;
  },

  //feedlist 만드는 부분
  makeFeedList: function (list) {
    if (list.length !== 0) {
      list.forEach(item => {
        const divItem = this.makeFeedItem(item);
        this.containerElem.appendChild(divItem);
      });
    }
    this.refreshSwipe();
    this.hideLoading();
  },

  makeFeedItem: function (item) {
    // console.log(item);
    const divContainer = document.createElement('div');
    divContainer.className = 'item mt-3 mb-3';

    const divTop = document.createElement('div');
    divContainer.appendChild(divTop);

    const regDtInfo = getDateTimeInfo(item.regdt);
    divTop.className = 'd-flex flex-row ps-3 pe-3';
    const writerImg = `<img class="profileimg" src='/static/img/profile/${item.iuser}/${item.mainimg}' 
          onerror='this.error=null;this.src="/static/img/profile/defaultProfileImg_100.png"'>`;

    divTop.innerHTML = `
          <div class="d-flex flex-column justify-content-center">
              <div class="circleimg h40 w40 pointer feedwin">${writerImg}</div>
          </div>
          <div class="p-3 flex-grow-1">
              <div>
                <span class="pointer bold feedwin">${item.writer}</span>
              </div>
              <div class="font_loc">${item.location === null ? '' : item.location}</div>
          </div>
      `;

    const feedwinList = divTop.querySelectorAll('.feedwin');
    feedwinList.forEach(el => {
      el.addEventListener('click', () => {
        moveToFeedWin(item.iuser);
      });
    });

    //이미지 스와이퍼 만드는 부분
    const divImgSwiper = document.createElement('div');
    divContainer.appendChild(divImgSwiper);
    divImgSwiper.className = 'swiper item_img';
    divImgSwiper.innerHTML = `
          <div class="swiper-wrapper align-items-center"></div>
          <div class="swiper-pagination"></div>
          <div class="swiper-button-prev"></div>
          <div class="swiper-button-next"></div>
      `;
    const divSwiperWrapper = divImgSwiper.querySelector('.swiper-wrapper');

    item.imgList.forEach(function (imgObj) {
      const divSwiperSlide = document.createElement('div');
      divSwiperWrapper.appendChild(divSwiperSlide);
      divSwiperSlide.classList.add('swiper-slide');

      const img = document.createElement('img');
      divSwiperSlide.appendChild(img);
      img.className = 'w100p_mw614';
      img.src = `/static/img/feed/${item.ifeed}/${imgObj.img}`;

      // 이미지 클릭시 이미지 보이기
      img.addEventListener('click', () => {
        const imgBox = document.createElement('div');
        imgBox.classList = 'modal modal-img d-flex pointer imgBox';
        imgBox.tabIndex = '2';
        imgBox.innerHTML = `
                        <div class="modal-dialog modal-dialog-centered">
                            <div class="modal-content img-modal-content">
                                <img src="${img.src}">
                            </div>
                        </div>`;
        const main = document.querySelector('main');
        main.appendChild(imgBox);
        imgBox.addEventListener('click', () => {
          imgBox.remove();
        });
      });
    });

    //좋아요, 디엠 버튼 만드는 부분
    const divBtns = document.createElement('div');
    divContainer.appendChild(divBtns);
    divBtns.className = 'favCont p-3 d-flex flex-row';

    //좋아요
    const heartIcon = document.createElement('i');
    divBtns.appendChild(heartIcon);
    heartIcon.className = 'fa-heart pointer rem1_5 me-3';
    heartIcon.classList.add(item.isFav === 1 ? 'fas' : 'far');

    //좋아요 버튼 이벤트
    heartIcon.addEventListener('click', e => {

      let method = 'POST';
      if (item.isFav === 1) { //delete (1은 0으로 바꿔줘야 함)
        method = 'DELETE';
      }

      /*
      let method = 'POST';
      if (item.isFav === 0) {
        divFav.classList.remove('d-none');
  
        item.favCnt = item.favCnt + 1;
        spanFavCnt.innerHTML = `좋아요 ${item.favCnt}개`;
      }
      if (item.isFav === 1) { //delete (1은 0으로 바꿔줘야 함)
        method = 'DELETE';
        divFav.classList.remove('d-none');
        item.favCnt = item.favCnt - 1;
        spanFavCnt.innerHTML = `좋아요 ${item.favCnt}개`;
        if (item.favCnt === 0) {
          divFav.classList.add('d-none');
        }
      }
      */

      fetch(`/feed/fav/${item.ifeed}`, {
        'method': method,
      }).then(res => res.json())
        .then(res => {
          if (res.result) {
            item.isFav = 1 - item.isFav; // 0 > 1, 1 > 0
            if (item.isFav === 0) { // 좋아요 취소
              heartIcon.classList.remove('fas');
              heartIcon.classList.add('far');
              item.favCnt--;
              if(item.favCnt === 0) {
                divFav.classList.add('d-none');
              }
            } else { // 좋아요 처리
              heartIcon.classList.remove('far');
              heartIcon.classList.add('fas');
              item.favCnt++;
              divFav.classList.remove('d-none');
            }
            spanFavCnt.innerHTML = `좋아요 ${item.favCnt}개`;
          } else {
            alert('좋아요를 할 수 없습니다.');
          }
        })
        .catch(e => {
          alert('네트워크에 이상이 있습니다.');
        });
    });

    //dm
    const divDm = document.createElement('div');
    divBtns.appendChild(divDm);
    divDm.className = 'pointer';
    divDm.innerHTML = `<svg aria-label="다이렉트 메시지" class="_8-yf5 " color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><line fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2" x1="22" x2="9.218" y1="3" y2="10.083"></line><polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" stroke-linejoin="round" stroke-width="2"></polygon></svg>`;

    //좋아요 갯수
    const divFav = document.createElement('div');
    divContainer.appendChild(divFav);
    divFav.className = 'p-3 d-none';
    const spanFavCnt = document.createElement('span');
    divFav.appendChild(spanFavCnt);
    spanFavCnt.className = 'bold';
    spanFavCnt.innerHTML = `좋아요 ${item.favCnt}개`;

    if (item.favCnt > 0) { divFav.classList.remove('d-none'); }

    //글 내용
    if (item.ctnt !== null && item.ctnt !== '') {
      const divCtnt = document.createElement('div');
      divContainer.appendChild(divCtnt);
      divCtnt.innerHTML = `
        <span class="pointer spanNick feedwin">${item.writer}</span>
        <span>${item.ctnt}</span>
      `;
      divCtnt.className = 'itemCtnt ps-3 pt-2';
    }

    //댓글 리스트
    const divCmtList = document.createElement('div');
    divContainer.appendChild(divCmtList);
    divCmtList.className = 'ms-3';

    //댓글 더보기
    const divCmt = document.createElement('div');
    divContainer.appendChild(divCmt);

    const spanMoreCmt = document.createElement('span');

    if (item.cmt) {
      const divCmtItem = this.makeCmtItem(item.cmt);
      divCmtList.appendChild(divCmtItem);

      if (item.cmt.ismore === 1) {
        const divMoreCmt = document.createElement('div');
        divCmt.appendChild(divMoreCmt);
        divMoreCmt.className = 'ms-3 mb-3 mt-2';

        divMoreCmt.appendChild(spanMoreCmt);
        spanMoreCmt.className = 'pointer rem0_9 c_lightgray';
        spanMoreCmt.innerText = '댓글 더보기..';
        spanMoreCmt.addEventListener('click', e => {
          this.getFeedCmtList(item.ifeed, divCmtList, spanMoreCmt);
        });
      }
    }

    //게시글 업로드한 시간
    const divDate = document.createElement('div');
    divContainer.appendChild(divDate);
    divDate.innerHTML = `<div class="reg_date p-3">${regDtInfo}</div>`;

    //댓글 폼
    const divCmtForm = document.createElement('div');
    divCmtForm.className = 'd-flex flex-row';
    divCmt.appendChild(divCmtForm);

    divCmtForm.innerHTML = `
          <input type="text" class="flex-grow-1 my_input back_color p-2 m-1" placeholder="댓글을 입력하세요...">
          <button type="button" class="btn btn-outline-primary">등록</button>
      `;

    //댓글 게시 이벤트
    const inputCmt = divCmtForm.querySelector('input');
    inputCmt.addEventListener('keyup', e => {
      if (e.key === 'Enter') {
        btnCmtReg.click();
      }
    });
    const btnCmtReg = divCmtForm.querySelector('button');
    btnCmtReg.addEventListener('click', e => {
      const param = {
        ifeed: item.ifeed,
        cmt: inputCmt.value
      };
      fetch('/feedcmt/index', {
        method: 'POST',
        body: JSON.stringify(param)
      })
        .then(res => res.json())
        .then(res => {
          if (res.result) {
            inputCmt.value = '';
            //댓글 공간에 댓글 내용 추가
            this.getFeedCmtList(param.ifeed, divCmtList, spanMoreCmt);
          }
        });
    });

    //유저 프로필로 가는 부분
    const feedWinList = divContainer.querySelectorAll('.feedwin');
    feedWinList.forEach(el => {
      el.addEventListener('click', () => {
        moveToFeedWin(item.iuser);
      });
    });
    
    return divContainer;
  },

  showLoading: function () { this.loadingElem.classList.remove('d-none'); },
  hideLoading: function () { this.loadingElem.classList.add('d-none'); },
  isLoading: function () { return !this.loadingElem.classList.contains('d-none'); }

}

//프로필 주소로 이동하는 함수
function moveToFeedWin(iuser) {
  location.href = `/user/feedwin?iuser=${iuser}`;
}


(function () {
  const btnNewFeedModal = document.querySelector('#btnNewFeedModal');
  if (btnNewFeedModal) {
    const modal = document.querySelector('#newFeedModal');
    const body = modal.querySelector('#id-modal-body');
    const frmElem = modal.querySelector('form');
    const btnClose = modal.querySelector('.btn-close');
    //이미지 값이 변하면
    frmElem.imgs.addEventListener('change', function (e) {
      console.log(`length: ${e.target.files.length}`);
      if (e.target.files.length > 0) {
        body.innerHTML = `
                  <div>
                      <div class="d-flex flex-md-row">
                          <div class="flex-grow-1 h-full"><img id="id-img" class="w300"></div>
                          <div class="ms-1 w250 d-flex flex-column">                
                              <textarea placeholder="문구 입력..." class="flex-grow-1 p-1"></textarea>
                              <input type="text" placeholder="위치" class="mt-1 p-1">
                          </div>
                      </div>
                  </div>
                  <div class="mt-2">
                      <button type="button" class="btn btn-primary">공유하기</button>
                  </div>
              `;
        const imgElem = body.querySelector('#id-img');

        const imgSource = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(imgSource);
        reader.onload = function () {
          imgElem.src = reader.result;
        };

        //게시물 갯수 id
        const myPost = document.querySelector('#myPost');

        const shareBtnElem = body.querySelector('button');
        shareBtnElem.addEventListener('click', function () {
          const files = frmElem.imgs.files;

          const fData = new FormData(); //ajax로 데이터 보낼때 FormData 사용
          for (let i = 0; i < files.length; i++) {
            fData.append('imgs[]', files[i]);
          }
          fData.append('ctnt', body.querySelector('textarea').value);
          fData.append('location', body.querySelector('input[type=text]').value);

          fetch('/feed/rest', {
            method: 'post',
            body: fData
          }).then(res => res.json())
            .then(myJson => {
              console.log(myJson);

              if (myJson) {
                btnClose.click();

                const lData = document.querySelector('#lData');
                const gData = document.querySelector('#gData');
                if (lData && lData.dataset.toiuser !== gData.dataset.loginiuser) { return; }

                // 남의 feedWin이 아니라면 화면에 등록!!!
                const feedItem = feedObj.makeFeedItem(myJson);
                feedObj.containerElem.prepend(feedItem);
                feedObj.refreshSwipe();

                //게시글 등록 시 내 피드 게시물 갯수 변경
                const myPostCnt = parseInt(myPost.innerText);
                myPost.innerText = myPostCnt + 1;

                //게시글 등록 시 최상위로 올라감
                window.scrollTo(0, 0);
              }
            });

        });
      }
    });

    btnNewFeedModal.addEventListener('click', function () {
      const selFromComBtn = document.createElement('button');
      selFromComBtn.type = 'button';
      selFromComBtn.className = 'btn btn-primary';
      selFromComBtn.innerText = '컴퓨터에서 선택';
      selFromComBtn.addEventListener('click', function () {
        frmElem.imgs.click();
      });
      body.innerHTML = null;
      body.appendChild(selFromComBtn);
    });
  }

})();