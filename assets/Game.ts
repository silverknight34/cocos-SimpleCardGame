import { _decorator, Component, Node, Sprite, UITransform, v3, EventTouch } from 'cc';
import { Card, CardID } from './Card';
import {tween} from 'cc'
const { ccclass, property } = _decorator;

@ccclass('Game')
export class Game extends Component {

    @property(Card) card: Card;
    @property(Node) point: Node;

    //初始化卡牌堆
    cards: CardID[] = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5]

    match = {
        node1:null,
        data1: -1,
        node2:null,
        data2: -1,
    }

    start() {
        this.ReOrder();
        this.Creat();
        this.Move();
    }


    click(){
        this.node.children.forEach((node, index) => {
            node.on(Node.EventType.TOUCH_END, (event: EventTouch) => {

                if(node === this.match.node1) return;
                else if(!this.match.node1){
                    const id = this.cards[index];
                    tween(node)
                    .to(0.5, { scale: v3(0, 1, 1)})
                    .call(() => {
                        const temp = node.getComponent(Sprite);
                        temp.spriteFrame = this.card.getID(id);
                    })
                    .to(0.5, { scale: v3(1, 1, 1)}).start();
                    this.match.node1 = node;
                    this.match.data1 = id;
                }
                else if(!this.match.node2){
                    const id = this.cards[index];
                    tween(node)
                    .to(0.5, { scale: v3(0, 1, 1)})
                    .call(() => {
                        const temp = node.getComponent(Sprite);
                        temp.spriteFrame = this.card.getID(id);
                    })
                    .to(0.5, { scale: v3(1, 1, 1)}).start();
                    this.match.node2 = node;
                    this.match.data2 = id;
                    if(this.match.data1 === this.match.data2) {
                        console.log('成功');
                        //等待翻牌动画播放
                        this.scheduleOnce(() => {
                            console.log('延迟执行');
                            this.match.node1.active = false;
                            this.match.node2.active = false;
                        }, 1.5);
                    }
                    
                    else {
                        console.log('失败');
                        tween(node).delay(1)
                        .to(0.5, { scale: v3(0, 1, 1)})
                        .call(() => {
                            const temp = node.getComponent(Sprite);
                            temp.spriteFrame = this.card.get2();
                        })
                        .to(0.5, { scale: v3(1, 1, 1)}).start();
                        
                        tween(this.match.node1).delay(1)
                        .to(0.5, { scale: v3(0, 1, 1)})
                        .call(() => {
                            const temp = this.match.node1.getComponent(Sprite);
                            temp.spriteFrame = this.card.get2();
                        })
                        .to(0.5, { scale: v3(1, 1, 1)}).start();

                    }
                    //等待翻牌动画播放
                    this.scheduleOnce(() => {
                        console.log('延迟执行');
                        this.match.node1 = null;
                        this.match.node2 = null;
                    }, 2);
                }

/*
                //点击翻牌
                console.log('click');
                const id = this.cards[index];
                tween(node)
                .to(0.5, { scale: v3(0, 1, 1)})
                .call(() => {
                    const temp = node.getComponent(Sprite);
                    temp.spriteFrame = this.card.getID(id);
                })
                .to(0.5, { scale: v3(1, 1, 1)}).start();
                
            this.match.node = node;
            this.match.data = id;
            console.log('click', this.match);
*/
            }, this);
        })
    }

    Move(){
        this.node.children.forEach((node, index) => {
            const posX = this.point.children[index].position.x;
            const posY = this.point.children[index].position.y;
            tween(node).delay(index * 0.1).to(0.5, { position: v3(posX, posY, 0) }).start();
        });

        this.scheduleOnce(() => {
            this.node.children.forEach((node, index) => {
                tween(node)
                .to(0.5, { scale: v3(0, 1, 1) })
                .call(() => {
                    const temp = node.getComponent(Sprite);
                    temp.spriteFrame = this.card.get2()
                })
                .to(0.5, { scale: v3(1, 1, 1) }).start();
            });
            this.click();
        }, 2)
    }


    ReOrder(){
        this.cards.sort((a, b) => 0.5 - Math.random());
        this.cards.sort((a, b) => 0.5 - Math.random());
        this.cards.sort((a, b) => 0.5 - Math.random());
    }

    Creat(){
        console.log('Creat', this.cards);
        this.cards.forEach(cardId =>{
            this.CreatCard(cardId);
        })
    }

    CreatCard(id){
        const node = new Node('cardp');
        this.node.addChild(node);
        const size = node.addComponent(UITransform);
        const temp = node.addComponent(Sprite);
        temp.sizeMode = Sprite.SizeMode.CUSTOM;
        size.setContentSize(140, 200);

        const sf = this.card.getID(id);
        temp.spriteFrame = sf;
    }


    update(deltaTime: number) {
        
    }
}


