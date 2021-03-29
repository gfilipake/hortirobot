import { Direction } from "./direction.enum";
import { ITile } from "./tile.model";

export interface IRobotPosition extends ITile {
    direction?: Direction
}