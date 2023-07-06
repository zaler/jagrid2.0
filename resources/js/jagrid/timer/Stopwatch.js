import axios from "axios";
import { useEffect, useState } from "react";

export default function Stopwatch(){

    const [time, setTime] = useState(1);
    const [running, setRunning] = useState(true);
    const [currentPath, setCurrentPath] = useState(location.pathname);

    useEffect(() => {
        let interval;
        if (running) {
            interval = setInterval(() => {
                setTime((prevTime) => prevTime + 1);
            }, 1000);
        } else if (!running) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [running]);

    useEffect(() => {
        axios.post('/tracking/time', {
            path: currentPath
        })
        .then(function (res) {

        })
        .catch(function (err) {

        });
        if(location.pathname != currentPath){
            setCurrentPath(location.pathname);
            setTime(1);
        }
    });

    return <></>
}