// @flow
import * as React from "react";

import {
  IonContent,
  IonIcon,
  IonInput,
  IonLabel,
  IonList,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTitle,
  useIonToast,
} from "@ionic/react";

import { Link, useParams } from "react-router-dom";

import { chevronBackOutline, trashBin } from "ionicons/icons";
import { useAuth } from "../../../../../contexts";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { ErrorMessage } from "@hookform/error-message";
import supabase from "../../../../../utils/supabase";

const BlockTimes = () => {
  const { sessionUser } = useAuth();

  const [showToast] = useIonToast();

  const id: any = useParams();
  const [editMode, setEditMode] = React.useState<boolean>(false);
  const [datesNewBlock, setDatesNewBlock] = React.useState<Array<string>>([]);
  const [allTimes, setAllTimes] = React.useState<Array<any>>([]);
  const [blockedTimes, setBlockedTimes] = React.useState<Array<any>>([]);
  const [currentBlock, setcurrentBlock] = React.useState<any>([]);

  const schema = Yup.object().shape({
    nameOfBlock: Yup.string(),
    timeToGoOut: Yup.string(),
    timeToGoIn: Yup.string(),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const handleGerateAllTimes = () => {
    let allTimes: Array<string> = [];

    for (let h = 9; h < 20; h++) {
      for (let m = 0; m <= 45; m = m + 15) {
        if (h < 10 && m === 0) {
          // console.log(`0${h}:0${m}`);
          allTimes.push(`0${h}:0${m}`);
        } else if (h < 10) {
          // console.log(`0${h}:${m}`);
          allTimes.push(`0${h}:${m}`);
        } else if (h >= 10 && m === 0) {
          // console.log(`${h}:0${m}`);
          allTimes.push(`${h}:0${m}`);
        } else if (h >= 10) {
          // console.log(`${h}:${m}`);
          allTimes.push(`${h}:${m}`);
        }
      }
    }

    setAllTimes(allTimes);
  };

  const handleGerateBlockTimes = (data: any) => {
    //se nao for alterado é undefined
    let timeToGoOutSelected;
    let timeToGoInSelected;

    if (data?.timeToGoOut === undefined && data?.timeToGoIn === undefined) {
      timeToGoOutSelected =
        currentBlock[0]?.blocked_times[
          currentBlock[0]?.blocked_times.length - 1
        ];
      timeToGoInSelected = currentBlock[0]?.blocked_times[0];
      console.log(1);
    } else if (
      data?.timeToGoOut === undefined &&
      data?.timeToGoIn !== undefined
    ) {
      timeToGoOutSelected =
        currentBlock[0]?.blocked_times[
          currentBlock[0]?.blocked_times.length - 1
        ];
      timeToGoInSelected = `${data?.timeToGoIn}`;
      console.log(2);
    } else if (
      data?.timeToGoOut !== undefined &&
      data?.timeToGoIn === undefined
    ) {
      timeToGoOutSelected = `${data?.timeToGoOut}`;
      timeToGoInSelected = currentBlock[0]?.blocked_times[0];
      console.log(3);
    } else {
      timeToGoOutSelected = `${data?.timeToGoOut}`;
      timeToGoInSelected = `${data?.timeToGoIn}`;

      console.log(4);
    }

    // separing the minut and hour of time selected
    let minsOfGoIn = timeToGoInSelected.substring(timeToGoInSelected.length, 3);
    let hoursOfGoIn = timeToGoInSelected.substring(0, 2);
    let timesOfLunch: Array<string> = [];

    for (
      let h = Number(hoursOfGoIn);
      timesOfLunch.includes(timeToGoOutSelected) !== true;
      h = h + 1
    ) {
      if (h > Number(hoursOfGoIn)) {
        for (let m = 0; m <= 45; m = m + 15) {
          if (h < 10 && m === 0) {
            // console.log(`0${h}:0${m}`);
            timesOfLunch.push(`0${h}:0${m}`);
          } else if (h < 10) {
            // console.log(`0${h}:${m}`);
            timesOfLunch.push(`0${h}:${m}`);
          } else if (h >= 10 && m === 0) {
            // console.log(`${h}:0${m}`);
            timesOfLunch.push(`${h}:0${m}`);
          } else if (h >= 10) {
            // console.log(`${h}:${m}`);
            timesOfLunch.push(`${h}:${m}`);
          }
          if (timesOfLunch.includes(timeToGoOutSelected)) {
            break;
          }
        }
      } else {
        for (let m = Number(minsOfGoIn); m <= 45; m = m + 15) {
          if (h < 10 && m === 0) {
            // console.log(`0${h}:0${m}`);
            timesOfLunch.push(`0${h}:0${m}`);
          } else if (h < 10) {
            // console.log(`0${h}:${m}`);
            timesOfLunch.push(`0${h}:${m}`);
          } else if (h >= 10 && m === 0) {
            // console.log(`${h}:0${m}`);
            timesOfLunch.push(`${h}:0${m}`);
          } else if (h >= 10) {
            // console.log(`${h}:${m}`);
            timesOfLunch.push(`${h}:${m}`);
          }
          if (timesOfLunch.includes(timeToGoOutSelected)) {
            break;
          }
        }
      }

      let nameOfBlock;
      let datesOfBlock;
      if (data?.nameOfBlock === undefined) {
        nameOfBlock = currentBlock[0]?.nome;
      } else {
        nameOfBlock = data?.nameOfBlock;
      }

      if (datesNewBlock.length === 0) {
        datesOfBlock = currentBlock[0]?.dates_blocked_times;
      } else {
        datesOfBlock = datesNewBlock;
      }

      handleSubmitNewBlockTimes(nameOfBlock, timesOfLunch, datesOfBlock);
    }
  };

  const handleGetCurrentBlock = async (blockid: string) => {
    try {
      let { data: block_times, error } = await supabase
        .from("block_times")
        .select("*")
        .eq("id", blockid);

      if (block_times) {
        setcurrentBlock(block_times);

        setDatesNewBlock(block_times[0]?.dates_blocked_times);
      }
    } catch (error) {}
  };

  const handleGetBlockedTimes = async () => {
    try {
      let { data, error } = await supabase.from("block_times").select("*");

      if (error) {
        await showToast({
          position: "top",
          message: error.message,
          duration: 3000,
        });
      }

      if (data) {
        await setBlockedTimes(data);
      }
    } catch (error) {
      await showToast({
        position: "top",
        message: `${error}`,
        duration: 3000,
      });
    }
  };

  const handleSubmitNewBlockTimes = async (
    name: string,
    times: Array<string>,
    dates: Array<string>
  ) => {
    try {
      const { data, error } = await supabase
        .from("block_times")
        .update([
          {
            nome: name,
            blocked_times: times,
            dates_blocked_times: dates,
          },
        ])
        .eq("id", id?.blockId);

      if (data) {
        showToast({
          position: "top",
          message: `Alterado com sucesso`,
          duration: 2000,
        });
        setTimeout(() => {
          document.location.reload();
        }, 2500);
      }
    } catch (error) {
      showToast({
        position: "top",
        message: `${error}`,
        duration: 5000,
      });
    }
  };

  React.useEffect(() => {
    handleGerateAllTimes();
    handleGetBlockedTimes();
    if (id) {
      handleGetCurrentBlock(id?.blockId);
    }
  }, []);

  return (
    <IonPage>
      <IonContent>
        {sessionUser && (
          <>
            <div className="h-screen bg-gray-100">
              <Link
                to="/app/config/daysoff/block-times"
                className="flex items-center bg-white p-5 border-b h-24"
              >
                <IonIcon className="w-6 h-6" src={chevronBackOutline} />

                <IonTitle className="font-bold">
                  {editMode ? "Editar Bloqueio" : "Ver Bloqueio"}
                </IonTitle>
              </Link>

              <form
                onSubmit={handleSubmit(handleGerateBlockTimes)}
                className="py-10 px-5"
              >
                <div className="bg-white rounded-3xl p-2 shadow-md">
                  <>
                    <div id="nome" className="my-5">
                      <IonLabel className="text-gray-600" position="stacked">
                        Nome
                      </IonLabel>
                      <div className="flex items-center bg-gray-200 rounded-3xl p-3 mt-1 text-black font-bold">
                        <IonInput
                          disabled={editMode ? false : true}
                          type="text"
                          className="placeholder:font-bold"
                          placeholder={`${currentBlock[0]?.nome}`}
                          {...register("nameOfBlock")}
                        />
                      </div>
                    </div>

                    {editMode && (
                      <p className="text-center">
                        Selecione o Horário para Bloqueio
                      </p>
                    )}
                    {editMode === false && (
                      <p className="text-center">Horário do Bloqueio</p>
                    )}

                    <div className="grid grid-cols-2 gap-5">
                      <div id="Start_Time">
                        <div className="flex justify-center items-center bg-gray-200 rounded-3xl p-3 mt-3 text-black font-bold text-black font-bold">
                          <IonSelect
                            disabled={editMode ? false : true}
                            className="bg-gray-200 rounded-3xl placeholder: text-gray-700 my-3 h-5"
                            placeholder={`${currentBlock[0]?.blocked_times[0]}`}
                            {...register("timeToGoIn")}
                          >
                            {allTimes.map((time, index) => (
                              <IonSelectOption key={index} value={time}>
                                {time}
                              </IonSelectOption>
                            ))}
                          </IonSelect>
                        </div>

                        <ErrorMessage
                          errors={errors}
                          name="timeToGoOut"
                          as={<div style={{ color: "red" }} />}
                        />
                      </div>
                      <div id="End_Time">
                        <div className="flex justify-center items-center bg-gray-200 rounded-3xl p-3 mt-3">
                          <IonSelect
                            disabled={editMode ? false : true}
                            className="bg-gray-200 rounded-3xl placeholder: text-gray-700 my-3 h-5 text-black font-bold"
                            placeholder={`${
                              currentBlock[0]?.blocked_times[
                                currentBlock[0]?.blocked_times.length - 1
                              ]
                            }`}
                            {...register("timeToGoOut")}
                          >
                            {allTimes.map((time, index) => (
                              <IonSelectOption key={index} value={time}>
                                {time}
                              </IonSelectOption>
                            ))}
                          </IonSelect>
                        </div>

                        <ErrorMessage
                          errors={errors}
                          name="timeToGoIn"
                          as={<div style={{ color: "red" }} />}
                        />
                      </div>
                      {editMode && (
                        <div className="flex justify-center items-center bg-gray-200 rounded-3xl shadow-md h-10 w-full my-3 col-span-2">
                          <IonInput
                            onIonChange={({ detail }) => {
                              let data = detail.value;
                              // console.log(data);
                              setDatesNewBlock((current) => [
                                ...current,
                                `${data}`,
                              ]);
                            }}
                            className="text-gray-500"
                            type="date"
                          />
                        </div>
                      )}
                    </div>
                  </>

                  {/* LISTA DAS DATAS do BLOQUEIO */}

                  <div
                    id="lista-bloqueios"
                    className="w-full col-span-2 h-auto shadow rounded-3xl py-3 bg-white mt-5"
                  >
                    <div className="flex justify-start mx-5">
                      <IonText className="ml-2 text-gray-500">
                        Datas do Bloqueio
                      </IonText>
                    </div>
                    <div className="flex justify-center">
                      <div className="h-[1px] w-4/5 bg-gray-500" />
                    </div>
                    <IonList className="w-full h-full p-5 rounded-3xl bg-transparent">
                      {datesNewBlock.map((date: any, index: any) => (
                        <div
                          key={index}
                          className="grid grid-cols-3 w-full py-2"
                        >
                          <IonLabel className="text-gray-500 col-span-2">
                            {date}
                          </IonLabel>
                          {editMode && (
                            <div className="flex justify-end items-center">
                              <IonIcon
                                onClick={() => {
                                  var removedDate = datesNewBlock;
                                  var index4Delete = removedDate.indexOf(date);
                                  removedDate.splice(index4Delete, 1);
                                  let datesRandom: Array<string> = [];

                                  const maxNumbers = removedDate.length;
                                  let list = [];
                                  for (let i = 0; i < maxNumbers; i++) {
                                    list[i] = i;
                                  }
                                  let randomNumber;
                                  let tmp;
                                  for (let i = list.length; i; ) {
                                    randomNumber = (Math.random() * i--) | 0;
                                    tmp = list[randomNumber];
                                    // troca o número aleatório pelo atual
                                    list[randomNumber] = list[i];
                                    // troca o atual pelo aleatório
                                    list[i] = tmp;
                                  }
                                  for (let i = 0; i < list.length; i++) {
                                    datesRandom.push(removedDate[list[i]]);
                                  }
                                  setDatesNewBlock(datesRandom);
                                }}
                                className="text-red-500 w-4 h-4"
                                src={trashBin}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </IonList>
                  </div>
                </div>
                <div
                  onClick={() => {
                    setEditMode(!editMode);
                  }}
                  className={`flex justify-center p-4 w-full rounded-xl text-white my-5 bg-gradient-to-l ${
                    editMode
                      ? "from-red-800 to-red-700"
                      : "from-green-800 to-green-700"
                  }`}
                >
                  {editMode ? "CANCELAR" : "EDITAR"}
                </div>

                {editMode && (
                  <button
                    type="submit"
                    className="flex justify-center p-4 w-full rounded-xl text-white my-5 bg-gradient-to-l from-green-800 to-green-700"
                  >
                    SALVAR
                  </button>
                )}
              </form>
            </div>
          </>
        )}
        {sessionUser === null && (
          <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
            <p className="text-black">você precisa estar logado</p>
            <Link to="/signup" className="text-cyan-500">
              Clique aqui
            </Link>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default BlockTimes;
