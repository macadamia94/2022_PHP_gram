<div id="gData" data-toiuser="<?=$this->data->iuser?>"></div>
<div class="d-flex flex-column align-items-center">
    <div class="size_box_100"></div>
    <div class="w100p_mw614">
        <div class="d-flex flex-row">            
            <div class="d-flex flex-column justify-content-center me-3">                
                <div class="circleimg h150 w150 pointer feedwin">                    
                    <img data-bs-toggle="modal" data-bs-target="#changeProfileImgModal" src='/static/img/profile/<?=$this->data->iuser?>/<?=$this->data->mainimg?>' onerror='this.error=null;this.src="/static/img/profile/defaultProfileImg_100.png"'>
                </div>
            </div>            
            <div class="flex-grow-1 d-flex flex-column justify-content-evenly">
                <div><?=$this->data->email?>
                    <?php
                        if($this->data->iuser === getIuser()) {
                            echo '<button type="button" id="btnModProfile" class="btn btn-outline-secondary">프로필 수정</button>';
                        } else {                            
                            $data_follow = 0;
                            $cls = "btn-primary";
                            $txt = "팔로우";

                            if($this->data->meyou === 1) {
                                $data_follow = 1;
                                $cls = "btn-outline-secondary";
                                $txt = "팔로우 취소";
                            } else if($this->data->youme === 1 && $this->data->meyou === 0) {
                                $txt = "맞팔로우 하기";
                            }
                            echo "<button type='button' id='btnFollow' data-youme='{$this->data->youme}' data-follow='{$data_follow}' class='btn {$cls}'>{$txt}</button>";
                        }
                    ?>
                </div>
                <div class="d-flex flex-row">
                    <div class="flex-grow-1 me-3">게시물 <span class="bold"><?=$this->data->feedcnt?></span></div>
                    <div class="flex-grow-1 me-3">팔로워 <span class="bold"><?=$this->data->followerCnt?></span></div>
                    <div class="flex-grow-1">팔로우 <span class="bold"><?=$this->data->followCnt?></span></div>
                </div>
                <div class="bold"><?=$this->data->nm?></div>
                <div><?=$this->data->cmt?></div>
            </div>
        </div>
        <div id="item_container"></div>
    </div>
    <div class="loading d-none"><img src="/static/img/loading.gif"></div>
</div>

<!-- 프로필 사진 바꾸기 -->
<div class="modal fade" id="changeProfileImgModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-md">
        <div class="modal-content">
            <div class="modal-header justify-content-center">
                <h5 class="modal-title bold">프로필 사진 바꾸기</h5>
            </div>
            <div class="_modal_item">
                <span class="c_primary-button bold pointer">사진 업로드</span>
            </div>
            <div class="_modal_item">
                <span class="c_error-or-destructive bold pointer">현재 사진 삭제</span>
            </div>
            <div class="_modal_item">
                <span class="pointer" data-bs-dismiss="modal">취소</span>
            </div>
        </div>
    </div>
</div>