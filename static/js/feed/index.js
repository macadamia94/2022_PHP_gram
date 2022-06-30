(function () { // 현재 함수에서만 사용할 수 있는 지역함수
  const btnNewFeedModal = document.querySelector('#btnNewFeedModal');
  if (btnNewFeedModal) { // header.php 13행
    const modal = document.querySelector('#newFeedModal');
    const body = modal.querySelector('#id-modal-body');
    const frmElem = modal.querySelector('form'); // modal안의 form태그
    const btnClose = modal.querySelector('.btn-close');

    //이미지 값이 변하면
    frmElem.imgs.addEventListener('change', function (e) {
      // form 태그에서는 id나 name과 같은 자식에게 접근할 때 점(.)으로 접근가능
      if (e.target.files.length > 0) { // input 타입 files의 길이가 0이상인 경우 파일을 선택했음을 의미
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
        const imgElem = body.querySelector('#id-img');  // body에 HTML을 넣고 id를 찾음

        // 컴퓨터에 있는 이미지 뿌리기
        const imgSource = e.target.files[0];  //e.target의 target → form 안에 있는 이미지 ∵거기서 이벤트가 발생했기 때문
        const reader = new FileReader();
        reader.readAsDataURL(imgSource);  // 내 컴퓨터에서의 이미지 위치값
        reader.onload = function () {  // onload : 로딩이 됬을 때 이벤트 발생
          imgElem.src = reader.result;  // 로딩 끝났을 때의 주소값을 src에 넣어줌
        };

        const shareBtnElem = body.querySelector('button');  // 삽입한 body안에서 태그가 버튼인 것을 찾음
        shareBtnElem.addEventListener('click', function () {
          const files = frmElem.imgs.files;

          const fData = new FormData();
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

              if (myJson.result) {
                btnClose.click();
              }

              // if (feedObj && myJson.result) {
              //   feedObj.refreshList();
              // }
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
        frmElem.imgs.click(); // frmElem : modal안의 form태그
      }); // 숨겨져 있는 form 태그가 강제로 클릭되도록 이벤트 설정
      body.innerHTML = null;  // body안을 한번 전부 삭제
      body.appendChild(selFromComBtn);
    });
  }

  const feedObj = {
    limit: 20,
    itemLength: 0,
    currentPage: 1,
    swiper: null,
    loadingElem: document.querySelector('.loading'),
    containerElem: document.querySelector('#item_container'),
    getFeedList: function () {
      this.showLoading();
      const param = {
        page: this.currentPage++
      }
      fetch('/feed/rest' + encodeQueryString(param))
        .then(res => res.json())
        .then(list => {
          this.makeFeedList(list);
        })
        .catch(e => {
          console.error(e);
          this.hideLoading();
        });
    },

    makeFeedList: function (list) {
      if (list.length !== 0) {
        list.forEach(item => {
          const divItem = this.makeFeedItem(item);
          this.containerElem.appendChild(divItem);
        });
      }

      if(this.swiper !== null) { this.swiper = null; }
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

      this.hideLoading();
    },
    makeFeedItem: function (item) {
      console.log(item);
      const divContainer = document.createElement('div');
      divContainer.className = 'item mt-3 mb-3';

      const divTop = document.createElement('div');
      divContainer.appendChild(divTop);

      const regDtInfo = getDateTimeInfo(item.regdt);
      divTop.className = 'd-flex flex-row ps-3 pe-3';
      const writerImg = `<img src='/static/img/profile/${item.iuser}/${item.mainimg}' 
        onerror='this.error=null; this.src="/static/img/profile/defaultProfileImg_100.png"'>`;

      divTop.innerHTML = `
          <div class="d-flex flex-column justify-content-center">
            <div class="circleimg h40 w40">${writerImg}</div>
          </div>
          <div class="p-3 flex-grow-1">
            <div><sapn class="pointer" onclick="moveToProfile(${item.iuser});">${item.writer}</sapn> - ${regDtInfo}</div>
            <div>${item.location === null ? '' : item.location}</div>
          </div>
        `;
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

      //TODO : imgList forEach
      item.imgList.forEach(function (imgObj) {
        const divSwiperSlide = document.createElement('div');
        divSwiperWrapper.appendChild(divSwiperSlide);
        divSwiperSlide.classList.add('swiper-slide');

        const img = document.createElement('img');
        divSwiperSlide.appendChild(img);
        img.className = 'w100p_mw614';
        img.src = `/static/img/feed/${item.ifeed}/${imgObj.img}`;
      });

      const divBtns = document.createElement('div');
      divContainer.appendChild(divBtns);
      divBtns.className = 'favCont p-3 d-flex flex-row';

      const heartIcon = document.createElement('i');
      divBtns.appendChild(heartIcon);
      heartIcon.className = 'fa-heart pointer rem1_5 me-3 ';
      heartIcon.classList.add(item.isFav === 1 ? 'fas' : 'far');

      const divDm = document.createElement('div');
      divBtns.appendChild(divDm);
      divDm.className = 'pointer';
      divDm.innerHTML = `<svg aria-label="다이렉트 메시지" class="_8-yf5 " color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><line fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2" x1="22" x2="9.218" y1="3" y2="10.083"></line><polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" stroke-linejoin="round" stroke-width="2"></polygon></svg>`;

      const divFav = document.createElement('div');
      divContainer.appendChild(divFav);
      divFav.className = 'p-3 d-none';
      const spanFavCnt = document.createElement('span');
      divFav.appendChild(spanFavCnt);
      spanFavCnt.className = 'bold';
      spanFavCnt.innerHTML = `좋아요 ${item.favCnt}개`;

      if (item.favCnt > 0) { divFav.classList.remove('d-none'); }

      if(item.ctnt !== null && item.ctnt !== '') {
        const divCtnt = document.createElement('div');
        divContainer.appendChild(divCtnt);
        divCtnt.innerText = item.ctnt;
        divCtnt.className = 'itemCtnt p-3';
      }

      const divCmtList = document.createElement('div');
      divContainer.appendChild(divCmtList);

      const divCmt = document.createElement('div');
      divContainer.appendChild(divCmt);
      const divCmtForm = document.createElement('div');
      divCmtForm.className = 'd-flex flex-row p-2'
      divCmt.appendChild(divCmtForm);

      divCmtForm.innerHTML = `
        <input type="text" class="flex-grow-1 my_input back_color" placeholder="댓글을 입력하세요...">
        <button type="button" class="btn btn-outline-primary">등록</button>
      `;

      return divContainer;
    },

    showLoading: function () { this.loadingElem.classList.remove('d-none'); },
    hideLoading: function () { this.loadingElem.classList.add('d-none'); }
  }
  feedObj.getFeedList();


})();