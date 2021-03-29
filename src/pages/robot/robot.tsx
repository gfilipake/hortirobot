import React from "react";
import { RouteComponentProps } from "react-router";
import { InputField } from "../../components/input-field/input-field";
import { TilePannel } from "../../components/tile-pannel/tile-pannel";
import { Direction } from "../../models/direction.enum";
import { IRobotPosition } from "../../models/robot-position.model";
import { ITileIrrigated } from "../../models/tile-irrigated.model";
import { ITile } from "../../models/tile.model";
import "./robot.scss";

interface IRobotProps
  extends RouteComponentProps<
    any,
    any,
    | { hortSize?: ITile; robotPosition?: IRobotPosition; choosenList: ITile[] }
    | any
  > {}

interface IRobotState {
  hortSize: ITile;
  choosenList: ITileIrrigated[];
  robotPosition: IRobotPosition;
  movementString: string;
}

export class Robot extends React.Component<IRobotProps, IRobotState> {
  $onKeyDown: any;
  constructor(props: IRobotProps) {
    super(props);

    this.state = {
      hortSize: {},
      choosenList: [],
      robotPosition: {},
      movementString: "",
    };

    this.$onKeyDown = this.passKeyBindToCorrectMethod.bind(this);
  }

  componentDidMount() {
    const { history } = this.props;

    if (history?.location?.state?.hortSize) {
      this.setState({
        hortSize: history.location.state.hortSize,
        robotPosition: history.location.state.robotPosition,
        choosenList: history.location.state.choosenList,
      });

      document.addEventListener("keydown", this.$onKeyDown, false);
      return;
    }

    this.props.history.replace("/");
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.$onKeyDown, false);
  }

  passKeyBindToCorrectMethod = (e: any) => {
    if (e.keyCode === 69 || e.keyCode === 68) {
      this.setRobotDirection(e.keyCode === 69);
      return;
    }

    if (e.keyCode === 77) {
      this.setRobotMovement();
      return;
    }

    if (e.keyCode === 73) {
      this.irrigate();
      return;
    }
  };

  setRobotDirection = (left: boolean) => {
    const { direction } = this.state.robotPosition;

    if (left) {
      this.setState({
        robotPosition: {
          ...this.state.robotPosition,
          direction: direction === Direction.Leste ? 0 : direction! + 1,
        },
        movementString: this.state.movementString + "E",
      });
      return;
    }

    this.setState({
      robotPosition: {
        ...this.state.robotPosition,
        direction: direction === Direction.Sul ? 3 : direction! - 1,
      },
      movementString: this.state.movementString + "M",
    });
  };

  setRobotMovement = () => {
    const { hortSize } = this.state;
    const robotPositionClone = { ...this.state.robotPosition };

    if (robotPositionClone.direction! === Direction.Norte) {
      robotPositionClone.y = robotPositionClone.y! + 1;
    }

    if (robotPositionClone.direction! === Direction.Sul) {
      robotPositionClone.y = robotPositionClone.y! - 1;
    }

    if (robotPositionClone.direction! === Direction.Leste) {
      robotPositionClone.x = robotPositionClone.x! + 1;
    }

    if (robotPositionClone.direction! === Direction.Oeste) {
      robotPositionClone.x = robotPositionClone.x! - 1;
    }

    if (
      robotPositionClone.x! > hortSize.x! ||
      robotPositionClone.y! > hortSize.y! ||
      robotPositionClone.x! < 0 ||
      robotPositionClone.y! < 0
    ) {
      return;
    }

    this.setState({
      robotPosition: robotPositionClone,
      movementString: this.state.movementString + "M",
    });
  };

  irrigate = () => {
    const { choosenList, robotPosition } = this.state;

    const index = choosenList.findIndex(
      (item) => item.x === robotPosition.x && item.y === robotPosition.y
    );

    if (index === -1) {
      return;
    }

    const choosenListClone = [...this.state.choosenList];

    choosenListClone[index].irrigated = true;

    this.setState({
      choosenList: choosenListClone,
      movementString: this.state.movementString + "I",
    });
  };

  renderHeader = () => (
    <>
      <span className="title bold">
        Instruções:
        <br />
        - D para virar 90º para a direita
        <br />
        - E para virar 90º para a esquerda
        <br />
        - M para movimentar o robô
        <br />- I ação de irrigação
      </span>
    </>
  );

  renderSizeSection = () => {
    const { hortSize } = this.state;

    return (
      <>
        <span className="normal-text bold">Tamanho da Horta:</span>
        <div className="double-input">
          <InputField
            withoutMarginTop
            title={"Valor em X:"}
            onChange={(value: string) =>
              this.setHortSize("x", parseInt(value, 10))
            }
            value={hortSize!.x}
            customType="number"
            numberProps={{
              max: 15,
              min: 1,
            }}
          />
          <InputField
            withoutMarginTop
            title={"Valor em Y:"}
            value={hortSize!.y}
            onChange={(value: string) =>
              this.setHortSize("y", parseInt(value, 10))
            }
            customType="number"
            numberProps={{
              max: 15,
              min: 1,
            }}
          />
        </div>
      </>
    );
  };

  setHortSize = (key: string, value: any) => {
    this.setState({
      hortSize: {
        ...this.state.hortSize,
        [key]: value,
      },
    });
  };

  renderHort = () => {
    const { hortSize, choosenList, robotPosition } = this.state;

    if (!hortSize || (hortSize && !hortSize.x) || (hortSize && !hortSize.y)) {
      return <div />;
    }

    return (
      <TilePannel
        tilePannelSize={{ x: hortSize.x! + 1, y: hortSize.y! + 1 }}
        robotPosition={robotPosition}
        choosenList={choosenList}
      />
    );
  };

  setChoosenList = (x: number, y: number, index: number) => {
    const choosenListCopy: ITile[] = [...this.state.choosenList];

    if (index !== -1) {
      choosenListCopy.splice(index, 1);
    } else {
      choosenListCopy.push({ x, y });
    }

    this.setState({
      choosenList: choosenListCopy,
    });
  };

  renderButton = () => {
    const { choosenList } = this.state;
    const irrigatedList = choosenList.filter((item) => item.irrigated);

    return (
      <button
        disabled={irrigatedList.length < choosenList.length}
        onClick={this.pushToFinalScreen}
      >
        Finalizar
      </button>
    );
  };

  pushToFinalScreen = () => {
    const { movementString } = this.state;
    this.props.history.push({
      pathname: "/final-screen",
      state: { movementString },
    });
  };

  render() {
    return (
      <div className="robot-container">
        {this.renderHeader()}
        {this.renderHort()}
        {this.renderButton()}
      </div>
    );
  }
}
