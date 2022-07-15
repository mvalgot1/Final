import { useEffect, useState } from "react";
const ShareBoard = ({user, socket, shareId}) => {
    console.log(shareId);
    const [img, setImg] = useState(null);
    const [imageMap, setImageMap] = useState(null);
    useEffect(() => {
        socket.on("whiteBoardDataResponse", (data) => {
            setImageMap(new Map(data.imgMap));
            if(data.ishost){
            setImg(data.imgURL);
            }
        });
    }, []);
    if(!user?.presenter){
        return(
            <div className="border border-dark border-3 h-100 w-100 overflow-hidden">
                <img
                    src={img}
                    alt="Real time whiteboard sharing"
                    style={{
                        height: window.innerHeight * 2,
                        width: "285%",
                    }}
                />
            </div>
        );
    }
    else if(user?.presenter && shareId != null){

        return(
            <div className="border border-dark border-3 h-100 w-100 overflow-hidden">
                <img
                    src={imageMap.get(shareId)}
                    alt="Real time whiteboard sharing"
                    style={{
                        height: window.innerHeight * 2,
                        width: "285%",
                    }}
                />
            </div>
        );
    }
    }

    export default ShareBoard