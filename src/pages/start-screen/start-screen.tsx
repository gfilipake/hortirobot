import React from "react";
import { RouteComponentProps } from "react-router";
import { InputField } from "../../components/input-field/input-field";
import { TilePannel } from "../../components/tile-pannel/tile-pannel";
import { Direction } from "../../models/direction.enum";
import { IRobotPosition } from "../../models/robot-position.model";
import { ITile } from "../../models/tile.model";
import "./start-screen.scss";

interface IStartScreenProps extends RouteComponentProps {}

interface IStartScreenState {
  hortSize: ITile;
  choosenList: ITile[];
  robotPosition: IRobotPosition;
}

export class StartScreen extends React.Component<
  IStartScreenProps,
  IStartScreenState
> {
  constructor(props: IStartScreenProps) {
    super(props);

    this.state = {
      hortSize: {
        x: 4,
        y: 5,
      },
      robotPosition: {
        x: 3,
        y: 2,
        direction: Direction.Norte,
      },
      choosenList: [],
    };
  }

  renderHeader = () => (
    <>
      <span className="title bold">
        Bem vindo ao HortiRobot, um robô desenvolvido pela empresa Hortaliças e
        Hortaliças.
        <br />
        Para começar digite o tamanho da horta, a posição em que o robô deve
        começar e escolha sua direção:
      </span>
    </>
  );

  renderSizeSection = () => {
    const { hortSize, choosenList } = this.state;

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
              max: 10,
              min: 0,
            }}
            disabled={choosenList.length > 0}
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
              max: 10,
              min: 0,
            }}
            disabled={choosenList.length > 0}
          />
        </div>
      </>
    );
  };

  setHortSize = (key: string, value: any) => {
    if (value > 10 || isNaN(value) || value < 0) {
      return;
    }

    this.setState({
      hortSize: {
        ...this.state.hortSize,
        [key]: value,
      },
      robotPosition: {
        x: 0,
        y: 0,
      },
    });
  };

  renderRobotPositionSection = () => {
    const { robotPosition } = this.state;

    return (
      <>
        <span className="normal-text bold hort-span">
          Posicao Inicial do Robo:
        </span>
        <div className="double-input">
          <InputField
            withoutMarginTop
            title={"Valor em X:"}
            onChange={(value: string) =>
              this.setRobotPosition("x", parseInt(value, 10))
            }
            value={robotPosition!.x}
            customType="number"
            numberProps={{
              max: 10,
              min: 0,
            }}
          />
          <InputField
            withoutMarginTop
            title={"Valor em Y:"}
            value={robotPosition!.y}
            onChange={(value: string) =>
              this.setRobotPosition("y", parseInt(value, 10))
            }
            customType="number"
            numberProps={{
              max: 10,
              min: 0,
            }}
          />
        </div>
      </>
    );
  };

  setRobotPosition = (key: string, value: any) => {
    const { hortSize } = this.state;

    if (key === "x") {
      if (value > hortSize!.x! || isNaN(value) || value < 0) {
        return;
      }
    }

    if (key === "y") {
      if (value > hortSize!.y! || isNaN(value) || value < 0) {
        return;
      }
    }

    this.setState({
      robotPosition: {
        ...this.state.robotPosition,
        [key]: value,
      },
    });
  };

  renderRobotDirectionSection = () => {
    return (
      <>
        <span className="normal-text bold hort-span">
          Aperte em qual direção:
        </span>
        <div className="robot-direction-section">
          <button onClick={() => this.setRobotDirection(Direction.Norte)}>
            Norte
          </button>
          <button onClick={() => this.setRobotDirection(Direction.Leste)}>
            Leste
          </button>
          <button onClick={() => this.setRobotDirection(Direction.Sul)}>
            Sul
          </button>
          <button onClick={() => this.setRobotDirection(Direction.Oeste)}>
            Oeste
          </button>
        </div>
      </>
    );
  };

  setRobotDirection = (direction: Direction) => {
    this.setState({
      robotPosition: {
        ...this.state.robotPosition,
        direction,
      },
    });
  };

  renderHort = () => {
    const { hortSize, choosenList, robotPosition } = this.state;

    if (!hortSize) {
      return <div />;
    }

    return (
      <>
        <span className="normal-text bold hort-span">
          Aperte em cima dos lugares os quais existem canteiro:
        </span>
        <TilePannel
          tilePannelSize={{ x: hortSize.x! + 1, y: hortSize.y! + 1 }}
          robotPosition={robotPosition}
          choosenList={choosenList}
          setChoosenList={this.setChoosenList}
        />
      </>
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

  renderButton = () => (
    <button
      onClick={this.pushToRobot}
      disabled={this.state.choosenList.length < 1}
    >
      Continuar
    </button>
  );

  pushToRobot = () => {
    const { hortSize, choosenList, robotPosition } = this.state;
    this.props.history.push({
      pathname: "/robot",
      state: { hortSize, choosenList, robotPosition },
    });
  };

  render() {
    return (
      <div className="start-screen-container">
        {this.renderHeader()}
        {this.renderSizeSection()}
        {this.renderRobotPositionSection()}
        {this.renderRobotDirectionSection()}
        {this.renderHort()}
        {this.renderButton()}
      </div>
    );
  }
}
