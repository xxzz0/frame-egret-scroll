namespace view{
	export class P1 extends Base{
		public constructor() {
			super();
			this.createScene();
		}
		//成员变量
		public pid="P1";
		private tweenLoop:egret.DisplayObject[]=[];
		private mapWidth:number=4000;
		private sv:ScrollView;//滚动对象
		private bgBox:egret.DisplayObjectContainer;//背景容器
		private tileWidth:number;//瓦块宽度
		private tileNum:number=4;//瓦块个数
		private tileShowNum:number;//瓦块显示数量
		private bgList:egret.Bitmap[];
		private agileBox:egret.DisplayObjectContainer;//活动元素容器
		//###创建场景###
		private createScene() {
			this.sv=new ScrollView(this.mapWidth);
			this.addChild(this.sv);
			this.bgBox=new egret.DisplayObjectContainer();
			this.sv.addChild(this.bgBox);
			this.agileBox=new egret.DisplayObjectContainer();

			this.sv.addChild(this.agileBox);
			this.sv.addEventListener(this.sv.EVENT.SCROLL,this.tick,this);

			this.init();
			this.tick();
        }
		private init(){
			//初始化背景列表
			this.bgList=[];
			this.tileWidth=(<egret.Texture>RES.getRes('bg1_jpg')).textureWidth;
			for(var i=0;i<this.tileNum;i++){
				var bg=new egret.Bitmap(RES.getRes('bg'+(i+1)+'_jpg'));
				bg.x=i*this.tileWidth;
				this.bgList.push(bg);
			};
			this.tileShowNum=Math.ceil(view.stage.stageWidth/this.tileWidth)+1;
		}
		/**判断可见性 */
		private judgeShow(obj:egret.DisplayObject):boolean{
			var b:boolean;
			var sx=obj.x+this.sv.scrollX-obj.anchorOffsetX;//转化为场景坐标,且中心点在左上角
			if(sx>-obj.width&&sx<view.stage.stageWidth){
				//可见
				b=true;
			}else{
				//不可见
				b=false;
			};
			return b;
		}
		private tick(){
			//更新背景
			this.bgBox.removeChildren();
			let bgIndex=Math.floor(-this.sv.scrollX/this.tileWidth);
			for(var i=0;i<this.tileShowNum;i++){
				var bg=this.bgList[bgIndex+i];
				if(bg) this.bgBox.addChild(bg);
			};
		}
		//###页面离开(动画)###
		public out(){
			for(var i=0;i<this.tweenLoop.length;i++){
				egret.Tween.removeTweens(this.tweenLoop[i]);
			}
		}
	}
}