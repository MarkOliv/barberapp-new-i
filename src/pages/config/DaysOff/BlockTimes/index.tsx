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

import { Link } from "react-router-dom";

import { chevronBackOutline, trashBin } from "ionicons/icons";
import { useAuth } from "../../../../contexts";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { ErrorMessage } from "@hookform/error-message";
import supabase from "../../../../utils/supabase";

const BlockTimes = () => {
  const { sessionUser } = useAuth();

  const [showToast] = useIonToast();

  const [editMode, setEditMode] = React.useState<boolean>(false);
  const [datesNewBlock, setDatesNewBlock] = React.useState<Array<string>>([]);
  const [allTimes, setAllTimes] = React.useState<Array<any>>([]);
  const [blockedTimes, setBlockedTimes] = React.useState<Array<any>>([]);

  const schema = Yup.object().shape({
    nameOfBlock: Yup.string().required("Nome do bloqueio é obrigatório"),
    timeToGoOut: Yup.string().required("O horário de saída é obrigatório"),
    timeToGoIn: Yup.string().required("O horário de entrada é obrigatório"),
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
    let timeToGoOutSelected = `${data?.timeToGoOut}`;
    let timeToGoInSelected = `${data?.timeToGoIn}`;

    // separing the minut and hour of time selected
    let minsOfGoIn = timeToGoOutSelected.substring(data?.timeToGoOut.length, 3);
    let hoursOfGoOut = timeToGoOutSelected.substring(0, 2);
    let timesOfLunch: Array<string> = [];

    console.log("time to go in =" + timeToGoInSelected);
    console.log("time to go out =" + timeToGoOutSelected);
    console.log("hoursOfGo out = " + hoursOfGoOut);
    console.log("mins of go in = " + minsOfGoIn);

    for (
      let h = Number(hoursOfGoOut);
      timesOfLunch.includes(timeToGoInSelected) !== true;
      h = h + 1
    ) {
      if (h > Number(hoursOfGoOut)) {
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
          if (timesOfLunch.includes(timeToGoInSelected)) {
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
          if (timesOfLunch.includes(timeToGoInSelected)) {
            break;
          }
        }
      }
      console.log(timesOfLunch);
      handleSubmitNewBlockTimes(data?.nameOfBlock, timesOfLunch, datesNewBlock);
    }
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
        .insert([
          { nome: name, blocked_times: times, dates_blocked_times: dates },
        ]);

      if (data) {
        showToast({
          position: "top",
          message: `Criado com sucesso`,
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
  }, []);

  return (
    <IonPage>
      <IonContent>
        {sessionUser && (
          <>
            <div className="h-screen bg-gray-100">
              <Link
                to="/app/config/daysoff"
                className="flex items-center bg-white p-5 border-b h-24"
              >
                <IonIcon className="w-6 h-6" src={chevronBackOutline} />

                <IonTitle className="font-bold">Bloquear horário</IonTitle>
              </Link>

              <form
                onSubmit={handleSubmit(handleGerateBlockTimes)}
                className="py-10 px-5"
              >
                <div className="bg-white rounded-3xl p-2 shadow-md">
                  {editMode && (
                    <>
                      <div id="nome" className="my-5">
                        <IonLabel className="text-gray-600" position="stacked">
                          Nome
                        </IonLabel>
                        <div className="flex items-center bg-gray-200 rounded-3xl p-3 mt-1">
                          <IonInput
                            type="text"
                            className="placeholder: text-gray-600"
                            placeholder="Nome do Bloqueio"
                            {...register("nameOfBlock")}
                          />
                        </div>
                      </div>

                      <p className="text-center">
                        Selecione o horário para bloqueio
                      </p>

                      <div className="grid grid-cols-2 gap-5">
                        <div id="Start_Time">
                          <div className="flex justify-center items-center bg-gray-200 rounded-3xl p-3 mt-3">
                            <IonSelect
                              className="bg-gray-200 rounded-3xl placeholder: text-gray-700 my-3 h-5"
                              placeholder={"hh:mm"}
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
                            name="timeToGoOut"
                            as={<div style={{ color: "red" }} />}
                          />
                        </div>
                        <div id="End_Time">
                          {editMode && (
                            <div className="flex justify-center items-center bg-gray-200 rounded-3xl p-3 mt-3">
                              <IonSelect
                                className="bg-gray-200 rounded-3xl placeholder: text-gray-700 my-3 h-5"
                                placeholder={"hh:mm"}
                                {...register("timeToGoIn")}
                              >
                                {allTimes.map((time, index) => (
                                  <IonSelectOption key={index} value={time}>
                                    {time}
                                  </IonSelectOption>
                                ))}
                              </IonSelect>
                            </div>
                          )}
                          <ErrorMessage
                            errors={errors}
                            name="timeToGoIn"
                            as={<div style={{ color: "red" }} />}
                          />
                        </div>
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
                      </div>
                    </>
                  )}
                  {/* LISTA DOS BLOQUEIOS */}
                  {!editMode && (
                    <div
                      id="lista-bloqueios"
                      className="w-full col-span-2 h-auto shadow rounded-3xl py-3 bg-white"
                    >
                      <div className="flex justify-start mx-5">
                        <IonText className="ml-2 text-gray-500">
                          Bloqueios Cadastrados
                        </IonText>
                      </div>
                      <div className="flex justify-center">
                        <div className="h-[1px] w-4/5 bg-gray-500" />
                      </div>
                      <IonList className="w-full h-full p-5 rounded-3xl bg-transparent">
                        {blockedTimes.map((blockTime, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-3 w-full py-2"
                          >
                            <IonLabel
                              onClick={() => {
                                document.location.replace(
                                  `/app/config/daysoff/block-times/edit/${blockTime?.id}`
                                );
                              }}
                              className="text-gray-500 col-span-2"
                            >
                              {blockTime?.nome}
                            </IonLabel>
                            <div className="flex justify-end items-center">
                              <IonIcon
                                onClick={async () => {
                                  const { data, error } = await supabase
                                    .from("block_times")
                                    .delete()
                                    .eq("id", blockTime?.id);

                                  if (data) {
                                    document.location.reload();
                                  }
                                }}
                                className="text-red-500 w-4 h-4"
                                src={trashBin}
                              />
                            </div>
                          </div>
                        ))}
                      </IonList>
                    </div>
                  )}

                  {/* LISTA DAS DATAS PARA NOVO BLOQUEIO */}
                  {editMode && (
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
                        {datesNewBlock.map((date, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-3 w-full py-2"
                          >
                            <IonLabel className="text-gray-500 col-span-2">
                              {date}
                            </IonLabel>
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
                          </div>
                        ))}
                      </IonList>
                    </div>
                  )}
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
                  {editMode ? "CANCELAR" : "NOVO BLOQUEIO"}
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
