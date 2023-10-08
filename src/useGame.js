import { useState, useEffect } from 'react';

const useGame = (socket) => {
    const [data, setData] = useState({
        players: 0,
        score: 0,
        gameStarted: false,
        gameEnded: false,
        isMole: false,
        mainClient: false,
        clientId: null,
        timeLeft: 60,
    });

    const handleJoinGame = () => {
        console.log(JSON.stringify(data, null, 2))
        socket.emit('joinGame', {});
    };

    const handleResetGame = () => {
        socket.emit('resetGame', {});
    };

    const handleStartGame = () => {
        socket.emit('startGame', {});
    };

    const handleDebugGame = () => {
        socket.emit('debug', {});
    }

    const handleRestartGame = () => {
        setData((prevState) => ({
            ...prevState,
            gameEnded: false,
            gameStarted: false,
            score: 0,
        }))
        socket.emit('restartGame', {});
    };

    const handleClick = () => {
        socket.emit('clickDevice', {});
    }

    useEffect(() => {
        socket.on('joinedGame', eventData => {
            setData((prevState) => ({
                ...prevState,
                mainClient: eventData.mainClient,
            }))
        });

    }, [socket]);

    useEffect(() => {
        socket.on('players', eventData => {
            setData((prevState) => ({
                ...prevState,
                players: eventData.players,
            }))
        })

    }, [socket]);

    useEffect(() => {
        socket.on('gameRestarted', () => {
            setData((prevState) => ({
                ...prevState,
                gameEnded: false,
                gameStarted: false,
                score: 0,
            }))
        })

    }, [socket]);

    useEffect(() => {
        socket.on('gameTimeUpdate', timeLeft => {
            setData((prevState) => ({
                ...prevState,
                timeLeft
            }))
        })
    }, [socket]);

    useEffect(() => {
        socket.on('joinedGame', eventData => {
            setData((prevState) => ({
                ...prevState,
                clientId: eventData.clientId,
            }))
        })
    }, [socket]);

    useEffect(() => {
        socket.on('gameStarted', eventData => {
            setData((prevState) => ({
                ...prevState,
                gameStarted: true,
            }))
            setData((prevState) => ({
                ...prevState,
                isMole: eventData.mole === data.clientId,
            }))
        });
    }, [socket, data]);

    useEffect(() => {
        socket.on('endGame', eventData => {
            setData((prevState) => ({
                ...prevState,
                gameEnded: true,
                score: eventData.score,
            }))
        });
    }, [socket]);

    useEffect(() => {
        const disconnectFromWebSocket = () => {
            socket.disconnect();
        };

        window.addEventListener('beforeunload', disconnectFromWebSocket);

        return () => {
            window.removeEventListener('beforeunload', disconnectFromWebSocket);
        };
    }, [socket]);

    return {
        data,
        handleJoinGame,
        handleResetGame,
        handleRestartGame,
        handleClick,
        handleStartGame,
        handleDebugGame,
    };
};

export default useGame;