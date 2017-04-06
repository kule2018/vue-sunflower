<template>
  <div class="headerWrapper">
    <header class="headContainer">
      <s-row type="flex" justify="end">
        <s-col span="6" class="title">
          <h1>SunFlower</h1>
        </s-col>
        <s-col span="10">
          <ul id="header-menu">
            <li><a href="#/guide/color">指南</a></li>
            <li><a href="#/components/grid">组件</a></li>
            <li><a href="#/ThirdParty/introduceChart">第三方资源</a></li>
          </ul>
        </s-col>
      </s-row>
    </header>
  </div>

</template>

<script>
  export default{

  }
</script>

<style>
  .headerWrapper{
    background-color: #639860;
    height: 70px;
  }
  .headContainer{
    width: 1140px;
    padding: 0 30px;
    margin: 0 auto;
  }
  .title{
    margin-right: auto;
    color: #ffffff;
  }
  #header-menu {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 70px;
    margin: 0;
    list-style: none;
  }
  #header-menu li a {
    color: #ffffff;
  }
  #header-menu li a:hover{
        color: #000000;
  }
</style>
