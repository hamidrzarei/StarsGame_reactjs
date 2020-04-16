import React, {useState, useEffect} from 'react';
import './App.css';

const StarsDisplay = props => (
    <>
        {utils.range(1, props.count).map(starId => (
            <div key={starId} className="star" />
        ))}
    </>
);

const PlayNumber = props => (
    <button
        className="number"
        style={{backgroundColor: colors[props.status]}}
        onClick={() => props.onClick(props.number, props.status)}
    >
        {props.number}
    </button>
);

const PlayAgain = props => (
    <div className="game-done">
        <div
            className="message"
            style={{color: props.gameStatus ==='lost' ? 'red' : 'green'}}
        >
            {props.gameStatus ==='lost' ? 'Game Over' : 'Nice'}
        </div>
        <button onClick={props.onClick}>Play Again</button>
    </div>
)

const useGameState = () =>{
    const [stars, setStars] = useState(utils.random(1, 9));
    const [availableNums, setAvailableNums] = useState(utils.range(1, 9));
    const [candidateNums, setCandidateNums] = useState([]);
    const [secondsLeft, setSecondsLeft] = useState(10);

    useEffect( () => {
        if(secondsLeft>0 && availableNums.length > 0){
            const timerId = setTimeout(() =>{
                setSecondsLeft(secondsLeft - 1);
            },1000);
            return() => clearTimeout(timerId);
        }
    });

    const setGameStatus =(newCandidateNums) =>{
        if (utils.sum(newCandidateNums) !== stars) {
            setCandidateNums(newCandidateNums);
        } else {
            const newAvailableNums = availableNums.filter(
                n => !newCandidateNums.includes(n)
            );
            setStars(utils.randomSumIn(newAvailableNums, 9));
            setAvailableNums(newAvailableNums);
            setCandidateNums([]);
        }
    };
    return {stars, availableNums, candidateNums, secondsLeft, setGameStatus};
}

const Game = (props) => {
    const {
        stars,
        availableNums,
        candidateNums,
        secondsLeft,
        setGameStatus
    } = useGameState();

    const candidatesAreWrong = utils.sum(candidateNums) > stars;
    const  gameStatus = availableNums.length === 0
        ? 'won'
        : secondsLeft === 0 ? 'lost' : 'active'

    const numberStatus = number => {
        if (!availableNums.includes(number)) {
            return 'used';
        }
        if (candidateNums.includes(number)) {
            return candidatesAreWrong ? 'wrong' : 'candidate';
        }
        return 'available';
    };

    const onNumberClick = (number, currentStatus) => {
        if (gameStatus!=='active' || currentStatus === 'used') {
            return;
        }

        const newCandidateNums =
            currentStatus === 'available'
                ? candidateNums.concat(number)
                : candidateNums.filter(cn => cn !== number);

        setGameStatus(newCandidateNums)
    };

    return (
        <div className="game">
            <header>
                <div className="master-head">
                    <div className="grid-container">
                        <div className="grid-item1">S</div>
                        <div className="grid-item2">T</div>
                        <div className="grid-item3">A</div>
                        <div className="grid-item4">R</div>
                        <div className="grid-item5">S</div>
                    </div>
                </div>
            </header>
            <div className="help">
                Select 1 or more numbers which equal to the number of stars
            </div>
            <div className="body">
                <div className="left">
                    {
                        gameStatus !=='active' ? (
                            <PlayAgain onClick={props.startNewGame} gameStatus={gameStatus}/>
                        ): (
                            <StarsDisplay count={stars} />
                        )
                    }
                </div>
                <div className="right">
                    {utils.range(1, 9).map(number => (
                        <PlayNumber
                            key={number}
                            status={numberStatus(number)}
                            number={number}
                            onClick={onNumberClick}
                        />
                    ))}
                </div>
            </div>
            <div className="timer">Watchout {secondsLeft} {secondsLeft > 1 ? 'seconds' : 'second'} left</div>
        </div>
    );
};

const StarMatch =() =>{
    const [gameId, setGameId] = React.useState(1);
    return <Game key={gameId} startNewGame={() => setGameId(gameId + 1)}/>;
}

const colors = {
    available: 'lightgray',
    used: 'lightgreen',
    wrong: 'lightcoral',
    candidate: 'deepskyblue',
};

const utils = {
    sum: arr => arr.reduce((acc, curr) => acc + curr, 0),
    range: (min, max) => Array.from({length: max - min + 1}, (_, i) => min + i),
    random: (min, max) => min + Math.floor(Math.random() * (max - min + 1)),
    randomSumIn: (arr, max) => {
        const sets = [[]];
        const sums = [];
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0, len = sets.length; j < len; j++) {
                const candidateSet = sets[j].concat(arr[i]);
                const candidateSum = utils.sum(candidateSet);
                if (candidateSum <= max) {
                    sets.push(candidateSet);
                    sums.push(candidateSum);
                }
            }
        }
        return sums[utils.random(0, sums.length - 1)];
    },
};

function App() {
  return (
      <StarMatch />
  );
}

export default App;