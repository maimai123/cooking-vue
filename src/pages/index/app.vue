<template>
	<div id="wrapper">
    <div class="spinner" v-if="isLoading">
      <div class="rect1"></div>
      <div class="rect2"></div>
      <div class="rect3"></div>
      <div class="rect4"></div>
      <div class="rect5"></div>
  	</div>
    <div v-else>
      <div class="navbar">
				<div class="home" @click="clearSearch"></div>
				<input type="text" placeholder="输入关键字搜索" id="search" v-model="searchVal"  @keypress="search"/>
				<div class="close"  @click="search2"></div>
        <ul  v-if="!doSearch">
          <li
            v-for="item in navNames"
						:data-id="item.id"
            @click="selected(item.name,item.id)"
            :class="{active:activeName == item.name}"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>
      <div id="main" class="main" v-if="!doSearch">
        <a href="http://www.chaping.io/Activity/Index/result" class="banner"></a>
        <!-- 列表展示 -->
        <div class="app_views">
					<transition-group name="slide-left">
            <div class="card" v-for="(item,index) in lists" :key="index" v-if="lists.length>0">
                <a :href="item.url"><div class="imgbox"
								:style="{backgroundImage:'url('+item.img+')',backgroundPosition:'center center',backgroundSize:'cover'}">
                </div></a>
                <a :href="item.url" class="content-box">
										<div class="title-m">
	                    {{ item.title }}
	                  </div>
	                  <!-- <div class="time-m">{{ item.create_time }}</div> -->
								</a>
            </div>
					</transition-group>
        </div>
      </div>
			<div class="searchbox" v-else>
        <!-- 搜索列表展示 -->
        <div class="app_views">
					<transition-group name="slide-left">
            <div class="card" v-for="(item,index) in searchList" :key="index" v-if="searchList.length>0">
                <a :href="item.url"><div class="imgbox"
								:style="{backgroundImage:'url('+item.img+')',backgroundPosition:'center center',backgroundSize:'cover'}">
                </div></a>
                <a :href="item.url" class="content-box">
										<div class="title-m">
	                    {{ item.title }}
	                  </div>
	                  <div class="content-m" v-html="filiterHtml(item.content)"></div>
								</a>
            </div>
					</transition-group>
					<div class="center" v-if="searchList.length==0">
						没有搜索到文章哦~
					</div>
        </div>
      </div>
			<div id="toast">没有更多了~</div>
			<div v-show="showCircle" class="showCircle">
				<a href="http://www.chaping.io/Activity/Book/huoguo">吐槽</a>
				<a href="http://www.chaping.io/Activity/Book/black">爆料</a>
				<a href="http://www.chaping.io/Activity/Book/chaping">建议</a>
			</div>
			<transition name="slide-fade"  v-if="showBtn">
				<div class="suspend" @click="changeCircle">
					<img src="http://app.chaping.tv/btn.png" alt="pic">
				</div>
			</transition >
    </div>
  </div>
</template>
<script>
export default {
	data(){
		return {
			isLoading: false,
      lists:[],
			navNames:[{id:'1',name:'互联网槽点'},{id:'2',name:'卧底黑幕'},{id:'3',name:'酷炫科技'}],
      activeName:'互联网槽点',
			visible:false,
			pageIndex:1,
			type:'1',
			searchVal:'',
			searchList:[],
			doSearch:false,
			showCircle:false,
			showBtn:true
		}
	},
	methods:{
		filiterHtml:function(htmls){
			var searchVal = this.searchVal;
			if(htmls.indexOf(searchVal) > 30){
				var last = htmls.substring(htmls.indexOf(searchVal)-23);
				return last;
			}else{
				return htmls;
			}
		},
    selected:function(name,id){
      this.activeName = name;
			this.doSearch = false;
			this.pageIndex = 1; //类别page重置为1
			this.type = id;
			this.lists=[];
			this.getLists();
    },
		clearSearch(){
			this.searchVal = '';
			this.doSearch =false;
			this.searchList = [];
		},
		search2(){
			var values = this.searchVal;
			this.doSearch = true;
			$.ajax({
				url:'http://www.chaping.io/Activity/Index/newssearch',
				type:"post",
				data:{
					wd:values
				},
				dataType:'json',
				success:function(result){
					if(result.length > 0){
						self.searchList = result;
					}else{
						self.searchList = [];
					}
				},
				error:function(){
					console.log("搜索请求失败");
				}
			});
		},
		search(e){
			var self = this;
			var values = e.target.value.replace(/(^\s*)|(\s*$)/g, "");
			if(e.keyCode == '13'){
				self.searchVal = values;
				self.doSearch = true;
				$.ajax({
					url:'http://www.chaping.io/Activity/Index/newssearch',
					type:"post",
					data:{
						wd:values
					},
					dataType:'json',
					success:function(result){
						if(result.length>0){
							self.searchList = result;
						}else{
							self.searchList = [];
						}
					},
					error:function(){
						console.log("搜索请求失败");
					}
				});
			}
		},
		changeVisible(){
			this.visible = true;
		},
		changeCircle(){
			this.showCircle = !this.showCircle;
		},
		getLists(){
			let self = this;
			let list = self.lists;
			// 获取新闻类表
			$.ajax({
				url:'http://www.chaping.io/Activity/Index/newslist',
				type: 'post',
				data:{
					't':self.type,
					'p':self.pageIndex
				},
		    dataType: 'json',
				success:function(data){
					var len = data.length;
					if(len > 0){
						for(var i=0;i<len;i++){
							list.push(data[i]);
						}
						self.isLoading = false;
					}else{
							$("#toast").fadeIn(300);
							setTimeout(function(){$("#toast").fadeOut(300);},1000);
					}
				},
				eror:function(data){
					console.log("新闻请求失败");
				}
			});

		},
		menu(){
			var self = this;
			var a = document.documentElement.scrollTop==0? document.body.clientHeight : document.documentElement.clientHeight;
			var b = document.documentElement.scrollTop==0? document.body.scrollTop : document.documentElement.scrollTop;
			var c = document.documentElement.scrollTop==0? document.body.scrollHeight : document.documentElement.scrollHeight;
			if(a+b == c){
				self.pageIndex += 1;
				self.getLists(self.type,self.pageIndex);
			}
			var scroTop = $(window).scrollTop();
			if(scroTop == 0){
				self.showBtn = true;
			}
		},
  },
	mounted() {
		var self = this;
    this.visible = false; //页面一进来不显示回到顶部按钮
		window.addEventListener('scroll', self.menu);
		$('.main').on('touchstart',function(e) {
      var touch = e.originalEvent.targetTouches[0];
      var start = touch.pageX;
			var scroTop = $(window).scrollTop();
			if(scroTop > 500){
				self.showBtn = false;
				self.showCircle = false;
			}else{
				self.showBtn = true;
			}
      });
		$('.main').on('touchend',function(e) {
	      var touch = e.originalEvent.changedTouches[0];
	      var end = touch.pageX;
	   });
  },
	created(){
    let self = this;
		let pageIndex = self.pageIndex;
		// 获取类别列表
		$.ajax({
			url:'http://www.chaping.io/Activity/Index/newstype',
			type: 'post',
	    dataType: 'json',
			success:function(data){
				self.navNames = data; //头部导航
				self.activeName = data[0].name;
				self.type = data[0].id;
				self.getLists(self.type,pageIndex);
			},
			eror:function(data){
				console.log("类别请求失败");
			}
		});
  }
}
</script>
<style lang="less" scoped>
@9:#999;
body{
	font-family:'Microsoft yahei';
}

*{
	padding:0;
	margin:0;
	box-sizing: border-box;
}
a{
	text-decoration: none;
	-webkit-tap-highlight-color:rgba(255,0,0,0);
}
#wrapper{
	width:100%;
	height:100vh;
	background-color:#131313;
}
#search{
	width:87%;
	height:.8rem;
	line-height:.8rem;
	border-radius:5px;
	background-color:transparent;
	border:1px solid #eee;
	margin:2% 2% 2% 1.1rem;
	padding:.2rem;
	font-size: .38rem;
	outline:none;
	color:white;
}

.home{
  width: .7rem;
  height: .7rem;
  display: inline-block;
  position: absolute;
  top: .2rem;
  left: .25rem;
  z-index: 99;
  background: url(http://app.chaping.tv/image/png/fangzi1.png) no-repeat;
  background-size: cover;
}
.navbar{
  position: fixed;
  top:0;
  width:100%;
  overflow:hidden;
  background-color:#131313;
  border-bottom: 1px solid #5a5a5a;
  z-index: 9;
  ul{
    width:100%;
    height:100%;
    list-style:none;
    margin:0;
    padding: 0;
		display: flex;
    justify-content: space-between;
    li{
      font-size: 0.35rem;
      float:left;
      margin:0 0.25rem;
      text-align:center;
      color:white;
      height: 0.96rem;
      line-height: 0.96rem;
    }
    .active{
      border-bottom: 2px solid #fff;
    }
  }
}
.content-m{
	font-size: 14px;
	color: #aaa;
	height: 1rem;
	overflow: hidden;
	margin: .2rem 0;
}
.main,.searchbox{
  background: #131313;
  width: 10rem;
	overflow: hidden;
	overflow-y: auto;
	overflow-scrolling: touch;
	-webkit-overflow-scrolling: touch;
	position: relative;
	top:2.15rem;
}
.searchbox{
	color:white;
	top:.96rem;
}
.close{
	box-sizing: content-box;
  position: absolute;
  top: 0.2rem;
  right: .3rem;
  width: .5rem;
  height: .5rem;
  border: 5px solid transparent;
  background: url(http://app.chaping.tv/image/png/sousuo.png) no-repeat;
  background-size: cover;
}
.center{
	text-align:center;
	margin: 20px auto;
	font-size: 16px;
}
.banner{
  width: 100%;
	display:block;
  height: 4rem;
  background: url('http://app.chaping.tv/buyuan/img/5.jpg') no-repeat;
  background-size: 100% 100%;
}
.image{
  width:2rem;
  height:2rem;
  float:left;
}
.card{
  display:flex;
  padding:.2rem;
  width:100%;
  height:2.8rem;
  margin:0.3466666666666667rem 0 0 0 ;
  border-bottom:1px solid #252525;
}
.card:last-child{
  margin-bottom: 0;
}
#toast{
	display: none;
	position: fixed;
	left: 50%;
	margin-left:-1.333rem;
	bottom: 0.5rem;
	width:2.6666666666666665rem;
	height:0.7rem;
	line-height: 0.7rem;
	text-align: center;
	background: rgba(0,0,0,.5);
	color:white;
	border-radius: 0.06666666666666667rem;
}
.card:after{
  content:'';
  display:block;
  clear:both;
}
.imgbox{
  width: 2.1466666666666665rem;
  height: 1.8533333333333333rem;
  overflow: hidden;
	-webkit-tap-highlight-color:rgba(255,0,0,0);
}
.content-box{
	display:block;
  width: 79%;
  height: 1.8533333333333333rem;
  position:relative;
  padding:0 0 0 0.4266666666666667rem;
  font-size: 0.35rem;
}

.title-m{
  font-size:0.48rem;
	color:#fff;
	overflow:hidden;
	text-overflow:ellipsis;
	display:-webkit-box;
	-webkit-box-orient:vertical;
	-webkit-line-clamp:2;
}
.time-m{
  font-size: 0.3466666666666667rem;
  color:#8e8e8e;
  display: inline-block;
  position: absolute;
  right: 0.1rem;
  bottom:0;
	font-family: sans-serif;
}
.time{
  color: #999;
}
.liked{
  color: red;
}
.like{
  color:#333;
}
.bottom{
  position: absolute;
  bottom: 0.1rem;
}

.button{
  font-size:0.35rem;
}
.spinner{
  z-index: 999;
  padding-top: 15%;
  box-sizing: border-box;
  text-align: center;
  width: 100%;
  height: 100vh;
  position:relative;
  text-align: center;
  font-size: 10px;
  overflow: hidden;
}
.spinner > div {
  background-color: #67CF22;
  height: 10%;
  width: 6px;
  display: inline-block;

  -webkit-animation: stretchdelay 1.2s infinite ease-in-out;
  animation: stretchdelay 1.2s infinite ease-in-out;
}

.spinner .rect2 {
  -webkit-animation-delay: -1.1s;
  animation-delay: -1.1s;
}

.spinner .rect3 {
  -webkit-animation-delay: -1.0s;
  animation-delay: -1.0s;
}

.spinner .rect4 {
  -webkit-animation-delay: -0.9s;
  animation-delay: -0.9s;
}

.spinner .rect5 {
  -webkit-animation-delay: -0.8s;
  animation-delay: -0.8s;
}

@-webkit-keyframes stretchdelay {
  0%, 40%, 100% { -webkit-transform: scaleY(0.4) }
  20% { -webkit-transform: scaleY(1.0) }
}

@keyframes stretchdelay {
  0%, 40%, 100% {
    transform: scaleY(0.4);
    -webkit-transform: scaleY(0.4);
  }  20% {
    transform: scaleY(1.0);
    -webkit-transform: scaleY(1.0);
  }
}
/*过渡动画*/
.slide-left-enter,
.slide-right-leave-active {
    opacity: 0;
    -webkit-transform: translate(50vw, 0);
}

.slide-left-leave-active,
.slide-right-enter {
    opacity: 0.1;
    -webkit-transform: translate(-50vw, 0);
}
.suspend{
	width:1.5rem;
	height:1.5rem;
	position: fixed;
	bottom:1rem;
	right:.5rem;
	z-index: 99;
	img{
		max-width: 100%;
	}
}
.showCircle{
	position: fixed;
	bottom:3rem;
	right:.5rem;
	color:white;
	font-size: 16px;
	a{
		display: block;
		color: white;
		border:1px solid #fff;
		padding: .1rem .35rem;
		border-radius: .5rem;
		background: black;
	}
	a:first-child{
		position: absolute;
		top: 1rem;
		left:-4rem;
	}
	a:nth-child(2){
		position: absolute;
		top: -.5rem;
		left:-3.5rem;
	}
	a:nth-child(3){
		position: absolute;
		top: -1.5rem;
		left:-2rem;
	}
}
/*展示动画*/
.slide-fade-enter-active {
  transition: all .2s ease;
}
.slide-fade-leave-active {
  transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-active {
  transform: translateY(60px);
  opacity: 0;
}
</style>
