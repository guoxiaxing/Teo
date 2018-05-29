import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//子组件
class Square extends React.Component{
	render(){
		return (
			<button className='square' onClick={this.props.onClick}>{this.props.value}</button>
		);
	}
}
//定义一个函数用来判断获胜者
function winerLast(arr){
	//定义一个数组来存储可能获胜的情况
	let winnerList = [
		[0,1,2],
		[3,4,5],
		[1,4,7],
		[0,3,6],
		[2,5,8],
		[6,7,8],
		[0,4,8],
		[2,4,6]
	];
	let len = winnerList.length;
	for(let i=0;i<len;i++){
		let [a,b,c] = winnerList[i];
		if(arr[a]&&arr[a]===arr[b]&&arr[a]===arr[c]){
			return arr[a];
		}
	}
	return null;
}
//父组件  棋盘
class Board extends React.Component{
	constructor(){
		/*继承this*/
		super();
		this.state = {
			/*定义一个数组用来存储每个小格的值*/
			arr:Array(9).fill(null),
			/*定义一变量来保证交替下棋*/
			XIsNext:true,
			//定义一个数组来保存历史记录
			history:[Array(9).fill(null)],
			stepNumber:0
		}
	}
	/*事件处理函数用来改变对应方格的内容*/
	handleClick(i){
		/*创建一个临时数组暂存值*/
		console.log(this.state.stepNumber);
		let len = this.state.arr.length;
		let brr = this.state.arr.concat();
		let tempHistory = this.state.history.slice(0,this.state.stepNumber+1);
	    //如果已经有人获胜或者某一个小格已经被点击则不可再重复操作
		if(winerLast(brr) || brr[i]){
			return;
		}
		brr[i] = this.state.XIsNext?'X':'O';
		tempHistory.push(brr);
		this.setState({
			arr:brr,
			history:tempHistory,
			XIsNext:!this.state.XIsNext,
			stepNumber:this.state.history.length
		});
	}
	//回退处理函数
	jumpTo(backI){
		console.log(this.state.history);
		console.log(backI);
		this.setState({
			arr:this.state.history[backI],
			stepNumber:backI,
			XIsNext:(backI%2)===0
		});
	}
	render(){
		/*定义一个数组用来装每一个格子*/
		let items = [];
		//获取获胜者信息
		let win = winerLast(this.state.arr);
		let tempHistory = this.state.history;
		//显示下棋步骤
		let moves = tempHistory.map((step,move)=>{
			let desc = move?'move to #' + move : 'Game start!';
			return (
				<li>
					<button onClick = {()=>this.jumpTo(move)}>{desc}</button>
				</li>
			)
		});
		let status;
		for(let i=0;i<9;i++){
			//通过属性将值传递给子组件
			items.push(<Square value={this.state.arr[i]} onClick={()=>this.handleClick(i)}/>);
		}
        //检查是否有人获胜
        if(win){
        	status = 'Winner:' + win;
        }else{
        	status = 'Next Player:' + (this.state.XIsNext ? 'X':'O');
        }
		/*将每一个小格渲染到页面*/
		return (
			<div className='board'>
				{items}
				<h3>{status}</h3>
				<ol>
					{moves}
				</ol>
			</div>
		)
	}
}
ReactDOM.render(
	<Board />,
	document.getElementById('root')
);
