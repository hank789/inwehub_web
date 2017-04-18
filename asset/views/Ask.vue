<template>
  <div class="page page-white">
    <div class="page-container">
      <div class="nav-bar" @click="$router.go(-1)">
        <div class="left">
          <span><i class="icon ion-ios-arrow-back"></i></span>
        </div>
        <div class="center">
          <span>提问</span>
        </div>
        <div class="right"></div>
      </div>
      <div class="form form-ask">
        <form>
          <textarea></textarea>
          <div class="title">请选择提问金额</div>
          <div class="category">
            <span class="active">88元</span>
            <span>188元</span>
            <span>其他金额</span>
            <span class="active">88元</span>
            <span>188元</span>
            <span><input type="text" value=""/> </span>
          </div>
          <div class="button-wrapper">
            <button class="button button-positive button-block">立即提问</button>
          </div>
          <div class="options">
            <input type="checkbox" /> 匿名
                    </div>
        </form>
      </div>
    </div>
  </div>
</template>

