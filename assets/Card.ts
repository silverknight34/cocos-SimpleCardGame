import { _decorator, Component, Node, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

export type CardID = 0 | 1 | 2 | 3 | 4 | 5;

@ccclass('Card')
export class Card extends Component {

    @property([SpriteFrame]) cards: SpriteFrame[] = [];
    
    getID(id: CardID){
        return this.cards[id];
    }
//卡牌背部ID
    get2(){
        return this.cards[6];
    }
}


