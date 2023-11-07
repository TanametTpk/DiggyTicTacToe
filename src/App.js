import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Button from "./components/Button";
import Square from "./components/Square";
import find_best_move from "./core/eggyTigtagtoeCore";
import {s1,s2,s3} from "./assets/sounds";
import Avatar from "./components/Avatar";
import {roastWords, winWords} from "./core/randomRoastWord";
import avatarImage from "./assets/8leg.jpg";

function App() {
    const [squares, setSquares] = useState(Array(9).fill(""));
    const [sizeSquares, setSizeSquares] = useState(Array(9).fill(-1));
    const [turn, setTurn] = useState("x");
    const [winner, setWinner] = useState(null);

    const [xSize, setXSize] = useState(1);
    const [OSize, setOSize] = useState(1);

    const [xAvailableSizes, setXAvailableSize] = useState([3,3,2])
    const [oAvailableSizes, setOAvailableSize] = useState([3,3,2])
    const [cacheBestMove, setCachebestMove] = useState([0, 0, 0])

    const [message, setMessage] = useState("")

    useEffect(() => {
        if (turn !== "o") return;
        const best_move = find_best_move(
            convert1DTo3x3(squares),
            convert1DTo3x3(sizeSquares.map(v => v + 1)),
            xAvailableSizes,
            oAvailableSizes
        )
    
        setCachebestMove(best_move)
        let newSize = best_move[2] - 1
        setOSize(newSize)

        if (newSize == OSize)
            updateSquares(3 * best_move[0] + best_move[1])
    }, [turn])

    useEffect(() => {
        if (turn !== "o") return
        let [row, col] = cacheBestMove
        updateSquares(3 * row + col)
    }, [OSize])
    
    const playSound = () => {
        let sounds = [s1,s2,s3]
        let sound = sounds[Math.floor((Math.random() * sounds.length))]
        new Audio(sound).play();;
    }

    const checkEndTheGame = () => {
        for (let square of squares) {
            if (!square) return false;
        }
        return true;
    };

    function convert1DTo3x3(arr) {
        if (arr.length !== 9) {
          throw new Error("Input array must have exactly 9 elements.");
        }
      
        const result = [];
        for (let i = 0; i < 3; i++) {
          const row = [];
          for (let j = 0; j < 3; j++) {
            const index = i * 3 + j;
            row.push(arr[index]);
          }
          result.push(row);
        }
      
        return result;
    }

    const getCurrentAvailableSize = () => {
        return turn === "x" ? xAvailableSizes : oAvailableSizes;
    }

    const getCurrentSize = () => {
        return turn === "x" ? xSize : OSize;
    }

    const checkWinner = () => {
        const combos = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        for (let combo of combos) {
            const [a, b, c] = combo;
            if (
                squares[a] &&
                squares[a] === squares[b] &&
                squares[a] === squares[c]
            ) {
                return squares[a];
            }
        }
        return null;
    };

    const canReplace = (ind) => {
        const currentSize = turn === "x" ? xSize : OSize;
        const availableSize = turn === "x" ? xAvailableSizes : oAvailableSizes;

        if (availableSize[currentSize] < 1) return false
        if (squares[ind] && squares[ind] !== turn && sizeSquares[ind] < currentSize) return true;
        if (!squares[ind]) return true;
        return false;
    }

    const getMaxSelectableSize = (availableSize) => {
        for (let index = availableSize.length - 1; index > -1; index--) {
            const size = availableSize[index];
            if (size > 0) return index;
        }

        return -1;
    }

    const updateSquares = (ind) => {
        if (!canReplace(ind) || winner) return;

        const s = squares;
        let sizeAvailables = turn === "x" ? xAvailableSizes : oAvailableSizes
        let setSizeAvailables = turn === "x" ? setXAvailableSize : setOAvailableSize
        let setSize = turn === "x" ? setXSize : setOSize;
        let size = turn === "x" ? xSize : OSize

        s[ind] = turn;
        sizeSquares[ind] = size;
        sizeAvailables[size] = sizeAvailables[size] - 1;

        setSquares(s);
        setSizeSquares(sizeSquares);
        setSizeAvailables(sizeAvailables)
        setTurn(turn === "x" ? "o" : "x");
        playSound()

        if (sizeAvailables[size] < 1)
            setSize(getMaxSelectableSize(sizeAvailables))

        const W = checkWinner();
        if (W) setWinner(W);
        else if (checkEndTheGame()) setWinner("x | o");
    }

    const resetGame = () => {
        let prevWinner = winner;

        setSquares(Array(9).fill(""));
        setSizeSquares(Array(9).fill(-1));
        setTurn("x");
        setWinner(null);

        setXSize(1);
        setOSize(1);

        setXAvailableSize([3,3,2])
        setOAvailableSize ([3,3,2])

        let words = prevWinner === "x" ? winWords : roastWords
        setMessage(words[Math.floor((Math.random() * words.length))])
    };

    return (
        <div className="tic-tac-toe">
            <div className=" absolute top-1" style={{right: "0.25rem"}}>
                <Avatar image={avatarImage} isPopOver={message} title={"8LEG"} message={message} />
            </div>
            <h1> Diggy Chess Simulator </h1>
            <Button handler={resetGame} text="reset game" />
            <div className="game">
                {Array.from("012345678").map((ind) => (
                    <Square
                        key={ind}
                        ind={ind}
                        updateSquares={updateSquares}
                        clsName={squares[ind]}
                        size={sizeSquares[ind]}
                    />
                ))}
            </div>
            <div className={`turn ${turn === "x" ? "left" : "right"}`}>
                <Square clsName="x" />
                <Square clsName="o" />
            </div>
            <div className="test">
                {
                    [
                        [0,1,2].map( (valueSize, ind) =>
                            {
                                if (getCurrentAvailableSize()[valueSize] < 1) return undefined;
                                return <div key={ind} className={"sizeBtn " + (getCurrentSize() === valueSize ? "enableSizeBtn" : "")}>
                                    <Square
                                        clsName={turn}
                                        size={valueSize}
                                        updateSquares={(idx) => {
                                            let setSizeAvailables = turn === "x" ? setXSize : setOSize
                                            setSizeAvailables(valueSize)
                                        }}
                                        customText={getCurrentAvailableSize()[valueSize]}
                                    />
                                </div>
                            }
                        )
                    ]
                }
            </div>
            <AnimatePresence>
                {winner && (
                    <motion.div
                        key={"parent-box"}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="winner"
                    >
                        <motion.div
                            key={"child-box"}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="text"
                        >
                            <motion.h2
                                initial={{ scale: 0, y: 100 }}
                                animate={{
                                    scale: 1,
                                    y: 0,
                                    transition: {
                                        y: { delay: 0.7 },
                                        duration: 0.7,
                                    },
                                }}
                            >
                                {winner === "x | o"
                                    ? "No Winner :/"
                                    : "Win !! :)"}
                            </motion.h2>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{
                                    scale: 1,
                                    transition: {
                                        delay: 1.3,
                                        duration: 0.2,
                                    },
                                }}
                                className="win"
                            >
                                {winner === "x | o" ? (
                                    <>
                                        <Square clsName="x" />
                                        <Square clsName="o" />
                                    </>
                                ) : (
                                    <>
                                        <Square clsName={winner} />
                                    </>
                                )}
                            </motion.div>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{
                                    scale: 1,
                                    transition: { delay: 1.5, duration: 0.3 },
                                }}
                            >
                                <Button handler={resetGame} text="reset game" />
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default App;
