class ScrollView extends egret.DisplayObjectContainer{
    constructor(public mapWidth:number){
        super();
        this.dist=this.mapWidth-view.stage.stageWidth;
        if(this.dist>0) this.isScroll=true;
        else this.isScroll=false;
        this.scrollX=0;
        this.touchEnabled=true;
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onStart,this);
    }
    EVENT={
        SCROLL:"scroll",
        END:"end"
    }
    scrollX:number;
    private dist:number;
    isScroll:boolean;
    private _x:number;
    private _stageX:number;
    private _tmove:boolean;//是否已滑动
    private onStart(e:egret.TouchEvent){
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.onMove,this);
        this.addEventListener(egret.TouchEvent.TOUCH_END,this.onEnd,this);
        this._x=this.scrollX-e.stageX;
        this._stageX=e.stageX;
        this._tmove=false;
    }
    private onMove(e:egret.TouchEvent){
        this.scrollX=this._x+e.stageX;
        if(this.scrollX>0){
            this.scrollX=0;
            this._x=this.scrollX-e.stageX;
        }else if(this.scrollX<-this.dist){
            this.scrollX=-this.dist;
            this._x=this.scrollX-e.stageX;
        };
        this.gxSpeed=e.stageX-this._stageX;
        this._stageX=e.stageX;
        
        this.scroll();

        this._tmove=true;
    }
    private onEnd(){
        this.removeEventListener(egret.TouchEvent.TOUCH_MOVE,this.onMove,this);
        this.removeEventListener(egret.TouchEvent.TOUCH_END,this.onEnd,this);
        this.inertia();
    }
    private scroll(){
        this.x=this.scrollX;
        this.dispatchEvent(new egret.Event(this.EVENT.SCROLL));
    }
    private end(){
        this.dispatchEvent(new egret.Event(this.EVENT.END));
    }
    //惯性滑动
    private gxSpeed=0;//惯性速度（最后一次手指滑动距离）
    private gxMaxSpeed=35;//最大惯性速度(手指一般最大滑动速度150)
    private gxTime=1000;//惯性时间
    private gxTimeStamp;
    /**惯性滚动 */
    private inertia(){
        if(!this._tmove) return;
        if(this.gxSpeed>=0) this.gxSpeed=Math.min(this.gxSpeed,this.gxMaxSpeed);
        else if(this.gxSpeed<0) this.gxSpeed=Math.max(this.gxSpeed,-this.gxMaxSpeed);
        if(Math.abs(this.gxSpeed)>5){
            this.removeEventListener(egret.Event.ENTER_FRAME,this.gxTick,this);
            this.addEventListener(egret.Event.ENTER_FRAME,this.gxTick,this);
            this.gxTimeStamp=egret.getTimer();
        }
    }
    /**惯性帧tick */
    private gxTick(){
        var delta=egret.getTimer()-this.gxTimeStamp;
        if(delta>=this.gxTime){
            //惯性运动完成
            delta=this.gxTime;
            this.gxComplete();
        }
        var t=delta/this.gxTime;
        var tween=egret.Ease.quadOut(t);
        this.scrollX+=(1-tween)*this.gxSpeed;
        if(this.scrollX>0){
            this.scrollX=0;
            this.gxComplete();
        }else if(this.scrollX<-this.dist){
            this.scrollX=-this.dist;
            this.gxComplete();
        };
        this.scroll();
    }
    private gxComplete(){
        this.removeEventListener(egret.Event.ENTER_FRAME,this.gxTick,this);
    }
}