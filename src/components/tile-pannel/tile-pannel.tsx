import React from "react";
import { ITile } from "../../models/tile.model";
import "./tile-pannel.scss";
import robotHeadIcon from "./robot-head-icon.png";
import { IRobotPosition } from "../../models/robot-position.model";
import { ITileIrrigated } from "../../models/tile-irrigated.model";

interface ITilePannelProps {
  tilePannelSize: ITile;
  choosenList: ITileIrrigated[];
  robotPosition: IRobotPosition;
  setChoosenList?: (xIndex: number, yIndex: number, index: number) => void;
}

export class TilePannel extends React.Component<ITilePannelProps, {}> {
  render() {
    const { tilePannelSize, choosenList, robotPosition } = this.props;

    const yBlocks = Array(tilePannelSize.y!).fill(null);
    const xBlocks = Array(tilePannelSize.x!).fill(null);

    return (
      <div className="tile-pannel-container">
        <div className="x-blocks-line">
          {xBlocks.map((_xBlock, index) => (
            <span key={`index-block-line ${index}`} >{index}</span>
          ))}
        </div>
        {yBlocks.map((_yBlock, yIndex) => {
          return (
            <div
              key={`y-blocks-container ${yIndex}`}
              className="y-blocks-container"
            >
              <span>{yIndex}</span>
              {xBlocks.map((xBlock, xIndex) => {
                const index = choosenList.findIndex(
                  (item) => item.x === xIndex && item.y === yIndex
                );

                return (
                  <div
                    onClick={
                      this.props.setChoosenList
                        ? () =>
                            this.props.setChoosenList!(xIndex, yIndex, index)
                        : void 0
                    }
                    className={`x-blocks-container ${
                      index !== -1 && "choosen"
                    } ${this.props.setChoosenList && "with-cursor"} ${index !== -1 && choosenList[index].irrigated && 'irrigated'}`}
                    key={`x-blocks-container ${xIndex}`}
                  >
                    {robotPosition.x === xIndex && robotPosition.y === yIndex && (
                      <img
                        src={robotHeadIcon}
                        style={{
                          transform: `rotate(${
                            robotPosition.direction! * 90
                          }deg)`,
                        }}
                        alt="Robot"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }
}
