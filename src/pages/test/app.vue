<template>
	<div id="wrapper">
    <div class="top-content">
			<transition name="slide-fade" v-on:after-enter="afterEnter">
				<div class="topBox" v-if="pageOne.showTop">
					<div class="logo"></div>
					<div class="product-logo"  :class="{w58:pageOne.isCreacte || !pageTwo.lists.isMyteam}">
						<img :src="pageOne.productLogo" alt="">
					</div>
					<div class="time" :class="{top6:pageOne.isCreacte || !pageTwo.lists.isMyteam}">
							<div class="title" v-if="!pageOne.isCreacte">活动时间</div>
							<div class="interval">{{pageOne.interval}}</div>
					</div>
				</div>
			</transition >
    </div>
		<transition name="bounce" >
			<img v-show="pageOne.showed" class="product" :src="pageOne.productImg" alt="pic"  :class="{top15:pageOne.isCreacte  || !pageTwo.lists.isMyteam}">
		</transition >
		<div class="bottom-content" :class="{top10:pageOne.isCreacte || !pageTwo.lists.isMyteam}">
			<!-- 队伍未创建 -->
			<div class="page1" v-if="!pageOne.isCreacte && pageTwo.lists.isMyteam">
				<div  @click="kgPop" class="details">活动详情</div>
				<template v-if="!pageOne.isCreacte">
					<div class="intro example">活动说明</div>
					<ol class="detaIntro" >
						<li v-for="(item, index) in pageOne.introList">{{ item }}</li>
				 </ol>
				  <div class="btnCreate" @click="createTeam">一键创建</div>
				</template>
				<template v-else>
					<h2>你已经成功组件团队了<br />赶紧去看看吧</h2>
					<div class="btnCreate" @click="goto">去看看</div>
				</template>
			</div>
			<!-- 队伍已创建 -->
			<div class="page2" v-else-if="!pageTwo.lists.isMyteam || pageOne.isCreacte">
				<transition name="fadeUp" v-if="pageOne.isCreacte || !pageTwo.lists.isMyteam">
					<div>
						<div class="intro example">组建团队</div>
						<!-- 团队未满 -->
						<div class="" v-if="!pageTwo.lists.isFull">
							<h2 v-if="pageTwo.lists.isJoinThisTeam || pageTwo.lists.isMyteam">五个人才能组成一个完整的团队哦，<br>快去寻找你的团员。</h2>
							<h2 v-else-if="pageTwo.lists.isJoin">你已经是别人的团员啦<br>别乱投门贴！</h2>
							<h2 v-else-if="pageTwo.lists.isJoin">你已经是别人的团员啦<br>别乱投门贴！</h2>
							<h2 v-else>挑选一个自己喜欢的位置加入吧</h2>
						</div>
						<!-- 团队已满 -->
						<div v-else>
							<h2 v-if="pageTwo.lists.isMyteam || pageTwo.lists.isJoinThisTeam">恭喜你，养成团组建成功。<br>记得5月18号13:00后回来看看结果。</h2>
							<h2 v-else-if="pageTwo.lists.hasTeam">你已经是别人的团员啦<br>别乱投门贴！</h2>
							<h2 v-else>我Kao没位置了！自己创建一个团队吧<br>你的大奖在等你</h2>
						</div>
						<div class="teamList">
							<div v-for="item in pageTwo.lists.list" :class="item.icon ? 'isSeat seat'+item.seat : 'seat'+item.seat" :data-seat="item.seat" @click="chooseSeat(item.seat)">
								<img :src="item.icon ? item.icon : pageTwo.emptyImg" alt="seat" />
							</div>
						</div>
						<!-- 未满 -->
						<div class="btn-group" v-if="!pageTwo.lists.isFull">
							<template v-if="pageTwo.lists.isMyteam">
								<div class="btnShare" @click="shareTeam">队员招募</div>
							</template>
							<template v-else>
								<div v-if="pageTwo.lists.isJoinThisTeam">
									<div class="btnShare" @click="shareTeam">队员招募</div>
								</div>
								<div v-if="!pageTwo.lists.hasTeam" class="btnShare gray" @click="goTeam">我也想要</div>
								<div v-if="pageTwo.lists.hasTeam" class="btnShare" @click="seeMyTeam">看看我的队伍</div>
							</template>
							</div>
							<!-- 成员已满 -->
							<div class="btn-group" v-else>
								<template v-if="!pageTwo.lists.isMyteam">
									<div v-if="!pageTwo.lists.hasTeam" class="btnShare gray" @click="goTeam">我也想要</div>
									<div v-else class="btnShare" @click="seeMyTeam">看看我的队伍</div>
								</template>
							</div>

					</div>
				</transition>
			</div>
		</div>
		<!-- 详情弹窗 start -->
		<transition name="fadeJoin" v-show="pageOne.popup" >
			<div v-show="pageOne.popup" class="popup">
				<div>
					<div class="introduction example">产品介绍</div>
					<p>{{pageOne.productIntro}}</p>
					<div class="joinin example">参与方式</div>
					<p>{{pageOne.joinWay}}</p>
					<div @click="kgPop" class="btnKnow">知道了</div>
				</div>
			</div>
		</transition>
		<!-- 详情弹窗 end -->
		<!-- 招募弹窗 start -->
		<transition name="fadeJoin" v-show="pageTwo.showJoin" >
			<div class="popup" v-show="pageTwo.showJoin" @click="closeShare">
				<div>
					<div class="cancel"  @click="closeShare"></div>
					<div class="introduction example">快来扫我</div>
					<ol>
						<li v-for="item in pageTwo.showList">{{item}}</li>
					</ol>
					<div class="qrCode">
						<img src="http://app.chaping.tv/thumbQRcode-1.png" alt="code">
					</div>
				</div>
			</div>
		</transition>
		<!-- 招募弹窗 end -->
		<!-- 加入弹窗 start -->
		<transition name="fadeJoin" v-show="pageTwo.isJoined" >
			<div class="popup popJoin" v-show="pageTwo.isJoined" @click="closeJoin">
				<div>
					<div class="trOrfa"><img :src="pageTwo.whatPic" alt=""></div>
					<div class="qrCode-1">
						<img src="http://app.chaping.tv/thumbQRcode-2.png" alt="code">
					</div>
				</div>
			</div>
		</transition>
		<!-- 加入弹窗 end -->
  </div>
</template>
<script>
export default {
	data(){
		return {
			pageOne:{
				productImg:'http://app.chaping.tv/lll.png',//产品图片
				productLogo:'http://app.chaping.tv/product.png', //产品名称
				interval:'5.4-5.8', //活动时期
				isCreacte:false, //是否有队伍
				showTop:false,
				showed:false, //产品图显示
				popup:false, //详情弹窗
				introList:[
					"寻找四名好友，组成你的宿舍",
					"最需要拯救的四间宿舍将随机获得一台扫地机器人（测完无需寄回）",
					"组建成功后记得5月8号13:00回来看看结果"
				],
				joinWay:'海尔扫地机器人拥有众多扫地机功能，海尔扫地机器人拥有众多扫地机功能，海尔扫地机器人拥有众多扫地机功能，海尔扫地机器人拥有众多扫地机功能，海尔扫地机器人拥有众多扫地机功能',
				productIntro:"海尔扫地机器人拥有众多扫地机功能，海尔扫地机器人拥有众多扫地机功能，海尔扫地机器人拥有众多扫地机功能，海尔扫地机器人拥有众多扫地机功能，海尔扫地机器人拥有众多扫地机功能，海尔扫地机器人拥有众多扫地机功能，"
			},
			pageTwo:{
				showJoin:false,
				showList:[
					'长按识别二维码加入队伍。',
					'最需要拯救的四组宿舍将获得扫地机器人的众测资格。'
				],
				lists:{
					openId:'111',
					isJoinThisTeam:false,
					isJoin:false,
					isMyteam:true,
					isFull:false,
					hasTeam:false,
					list:[
						{
							icon:'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1564076129,2977414301&fm=117&gp=0.jpg',
							seat:0
						},
						{
							seat:1,
							icon:''
						},
						{
							seat:2,
							icon:'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2641106727,69344425&fm=111&gp=0.jpg'
						},
						{
							seat:3,
							icon:''
						},
						{
							seat:4,
							icon:'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2641106727,69344425&fm=111&gp=0.jpg'
						},
					]
				},
				isJoined:false,
				whatPic:'http://app.chaping.tv/bgCross.png',
				emptyImg:'http://app.chaping.tv/btnPlus.png'
			}
		}
	},
	methods:{
		afterEnter(){ //进入动画完成回调
			this.pageOne.showed = true;
		},
		kgPop(){ //详情弹窗
			this.pageOne.popup = !this.pageOne.popup;
		},
		createTeam(){ //创建团队
			this.pageOne.isCreacte = true;
		},
		goto(){ //查看团队
			this.pageOne.isCreacte = true;
		},
		goTeam(){ //创建队伍
			window.location.href="http://localhost:8080/test.html";
		},
		seeMyTeam(){ //查看我的队伍
			window.location.href="http://localhost:8080/test.html";
		},
		shareTeam(){ // 会员招募
			this.pageTwo.showJoin =  true;
		},
		closeShare(e){ // 关闭会员招募
			if(e.target.className == 'popup' || e.target.className == 'cancel'){
				this.pageTwo.showJoin =  false;
			}
		},
		chooseSeat(seatId){
			let datas = this.pageTwo.lists;
			if(event.target.offsetParent.className.substr(0,6) == 'isSeat' || event.target.className.substr(0,6) == 'isSeat'){
				console.log("座位被人坐啦！");
			}else{
				if(datas.isJoinThisTeam || datas.isJoin){ //已经加入过这个队伍或加了别队伍了
					console.log("不能加入这个team");
				}else{
					console.log("可以加入哦");
				}
			}
		}
  },
	mounted() {
		this.pageOne.showTop = true;
		function GetQueryString(name)
		{
		     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
		     var r = window.location.search.substr(1).match(reg);
		     if(r!=null)return  unescape(r[2]); return null;
		}
		var share = GetQueryString("")
  },
	created(){
    let self = this;
		// 获取类别列表
		// $.ajax({
		// 	url:'http://www.chaping.io/Activity/Index/newstype',
		// 	type: 'post',
	  //   dataType: 'json',
		// 	success:function(data){
		// 		self.navNames = data; //头部导航
		// 		self.activeName = data[0].name;
		// 		self.type = data[0].id;
		// 		self.getLists(self.type,pageIndex);
		// 	},
		// 	eror:function(data){
		// 		console.log("类别请求失败");
		// 	}
		// });
  }
}
</script>
<style lang="less">
@black:#1d1c22;
body{
	font-family:'Microsoft yahei';
	overflow-x: hidden;
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
	background-color:@black;
	position: relative;
}
.top-content{
	position: relative;
	width:10rem;
	height:48vh;
	background:url('http://app.chaping.tv/thumbBg.png') no-repeat;
	background-size:100% 100%;
	z-index: 1;
	.topBox{
		border:0.15rem solid white;
		border-bottom:0;
		width:9rem;
		height:46vh;
		position: absolute;
		left:50%;
		margin-left:-4.5rem;
		bottom:0;
		z-index: 0;
	}
	.logo{
		margin:0.4266666666666667rem 0 .8rem 0.36rem;
		width:3.3333333333333335rem;
		height: 0.5333333333333333rem;
		background: url('http://app.chaping.tv/logo.png') no-repeat;
		background-size:cover;
	}
	.product-logo{
		width: 7.866666666666666rem;
		height: 1.9466666666666668rem;
		margin:0 auto;
		img{
			width: 100%;
		}
	}
	.w58{
		animation: smallW .5s forwards;
	}
	@keyframes smallW {
		0% {
			width: 7.866666666666rem;
			margin:0 auto;
		}
		100% {
			width: 5.866666666666rem;
			margin-left:.2rem;
		}
	}
	.time{
		margin:1.3333333333333333rem 0 0 1.1066666666666667rem;
		width: 2.9rem;
		height: 1.2rem;
		background: url('http://app.chaping.tv/iconTime.png') no-repeat;
		background-size:0.6rem 0.6rem;
		background-position:0 .05rem;
		padding-left: 0.84rem;
		color:white;
		line-height: 1.3;
	}
	.top6{
		animation: slideUp .5s forwards;
	}
	@keyframes slideUp {
	  0% {
			margin-top: 1.3333333333333333rem;
	  }
	  100% {
	  	margin-top: .3rem;
	  }
	}

	.title{
		font-size: 16px;
		font-weight: 500;
		letter-spacing: 2px;
	}
	.interval{
		font-size: 20px;
		letter-spacing: 1px;
	}
}
.product{
	width: 4.4rem;
	height: 4.4rem;
	position: absolute;
	right: 0.8rem;
	top:4.5rem;
	z-index:3;
}
.top15{
	top: 1.5rem ;
	animation: slideUp2 .5s forwards;
}
@keyframes slideUp2 {
	0% {
		width: 4.4rem;
		top: 4.5rem;
	}
	100% {
		width:4rem;
		right:.2rem;
		top: 1.7rem;
	}
}
.top10{
	top:-10vh;
	height: 67vh !important;
	animation: bouncein .5s forwards;
}
@keyframes bouncein {
  0% {
  	top:0;
    height: 52vh !important;
  }
  100% {
  	top:-15vh;
    height: 67vh !important;
  }
}
@keyframes bounceout {
  0% {
		top:-15vh;
    height: 67vh !important;
  }
  100% {
		top:0;
    height: 52vh !important;
  }
}
.bottom-content{
	position:relative;
	width:10rem;
	height:52vh;
	color: white;
	transition: height .5s;
	padding: 1.1733333333333333rem 0.8rem 0 .8rem;
	z-index: 2;
	background-color:@black;
	.page1 h2{
		margin:2rem auto;
		text-align: center;
		font-size: 24px;
	}
	.intro{
		width: 3.56rem;
		height: 0.9rem;
		background:url('http://app.chaping.tv/ui-kit.png') no-repeat;
		background-size:0.6rem 0.48rem;
		background-position: 0 .28rem;
	}
	.details{
		width: 2rem;
		height: 0.84rem;
		position: absolute;
		right: 0;
		top: 1.1733333333333333rem;
		background:url('http://app.chaping.tv/details.png') no-repeat;
		background-size:100% 100%;
		font-size: 14px;
		line-height: .84rem;
		text-indent: .4rem;
	}
	.detaIntro{
		margin: 0.8rem 0 0 .48rem;
		font-size: 16px;
		line-height: 1.6;
	}
	.btnCreate{
		width:5.12rem;
		height: 0.9866666666666667rem;
		line-height: 0.9866666666666667rem;
		text-align: center;
		font-size: 16px;
		background:url('http://app.chaping.tv/btnCreated.png') no-repeat;
		background-size:100% 100%;
		margin:1.2rem auto;
	}
}
.page2 h2{
	text-align: center;
	margin: .3rem 0;
	font-weight: normal;
}
.teamList{
	overflow: hidden;
	width: 100%;
	height: 3.44rem;
	margin-top: 1rem;
	position: relative;
}
.teamList>div{
	width: 1.52rem;
	height: 1.52rem;
	border-radius: 50%;
	overflow: hidden;
}
.teamList div>img{
	width: 100%;
}
.teamList .seat0{
	position: absolute;
	left:1.1733333333333333rem;
}
.teamList .seat1{
	position: absolute;
	left:3.466666666666667rem;
}
.teamList .seat2{
	position: absolute;
	left:5.733333333333333rem;
}
.teamList .seat3{
	position: absolute;
	top: 1.8666666666666667rem;
	left:2.2133333333333334rem;
}
.teamList .seat4{
	position: absolute;
	top: 1.8666666666666667rem;
	left:4.626666666666667rem;
}
.btn-group{
	display: flex;
	justify-content: center;
}

.btnShare{
	height: 0.9866666666666667rem;
	line-height: 0.9rem;
	text-align: center;
	padding: 0 1rem;
	font-size: 16px;
	border:1.2px solid #fff;
	border-radius: 1rem;
	display: inline-block;
	margin:.8rem .2rem;
}
.gray{
	border:1.5px solid #aaa;
}
.example{
	font-weight: 600;
	background-position: 0 .25rem;
	font-size: 22px;
	padding:0.1rem 0 0.1rem 0.9866666666666667rem;
	letter-spacing: 2px;
}

.popup{
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom:0;
	background: rgba(0,0,0,.01);
	-webkit-tap-highlight-color: rgba(255,0,0,0);
	z-index: 99;
	>div{
		width: 8.373333333333333rem;
		margin:1rem auto;
		position: relative;
		background: url('http://app.chaping.tv/bgQRcode.png') no-repeat;
		background-size:100% 100%;
		padding: 1.8666666666666667rem 0.9066666666666666rem;
		p{
			line-height: 1.2;
			font-size: 15.5px;
		}
	}
	.cancel{
		width:0.56rem;
		height: 0.56rem;
		background: url('http://app.chaping.tv/btnCancel.png') no-repeat;
		background-size:100% 100%;
		position: absolute;
		top:.4rem;
		right: .3rem;
	}
	ol{
		margin-left: 0.4rem;
		font-size: 16px;
	}
	.qrCode{
		width:4.4rem;
		height: 4.4rem;
		margin:1rem auto;
		img{
			width: 100%;
			height: 100%;
		}
	}
	.qrCode-1{
		width:3.9466666666666668rem;
		height: 5.306666666666667rem;
		margin:1rem auto;
		img{
			width: 100%;
			height: 100%;
		}
	}
	.trOrfa{
		width: 100%;
		height: 3.7333333333333334rem;
		img{
			width: 100%;
			height: 100%;
		}
	}
	.introduction{
		width: 3.56rem;
		height: 0.9rem;
		background:url('http://app.chaping.tv/ui-kit-2.png') no-repeat;
		background-size:0.6rem 0.48rem;
		background-position:  0 .2rem;
		margin-bottom: 0.4rem;
	}
	.joinin{
		width: 3.56rem;
		height: 0.9rem;
		background:url('http://app.chaping.tv/ui-kit-2.png') no-repeat;
		background-size:0.6rem 0.48rem;
		background-position:  0 .2rem;
		margin-top:.4rem;
		margin-bottom: 0.4rem;
	}
	.btnKnow{
		width:5.12rem;
		height: 0.9866666666666667rem;
		line-height: 0.9866666666666667rem;
		text-align: center;
		background:url('http://app.chaping.tv/btnKnow.png') no-repeat;
		background-size:100% 100%;
		font-size: 18px;
		position: relative;
		left: 50%;
		margin-left: -2.56rem;
		bottom: -.7rem;
	}
}
.popJoin > div{
	 padding: 0 0 1rem 0;
}
/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
/*展示动画*/
.slide-fade-enter-active {
  transition: all .5s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-active {
  transform: translateY(60px);
  opacity: 0;
}
/*产品动画*/
.bounce-enter-active {
  transition: all .5s ease;
}
.bounce-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.bounce-enter, .bounce-leave-active {
  transform: translateX(2rem);
  opacity: 0;
}
/*页面淡出*/
.bounce-enter-active {
  transition: all .8s ease;
}
.bounce-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.bounce-enter, .bounce-leave-active {
  transform: translateX(2rem);
  opacity: 0;
}
/*详情动画*/
.fadeUp-enter-active {
  transition: all .5s ease;
}
.fadeUp-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.fadeUp-enter, .fadeUp-leave-active {
  transform: translateY(60px);
  opacity: 0;
}
/*招募动画*/
.fadeJoin-enter-active {
  transition: all .3s ease;
}
.fadeJoin-leave-active {
  transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.fadeJoin-enter, .fadeJoin-leave-active {
  transform: translateY(160px);
  opacity: 0;
}

</style>
