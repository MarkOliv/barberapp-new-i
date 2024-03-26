// @flow
import * as React from "react";

import {
  IonContent,
  IonIcon,
  IonInput,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTitle,
  useIonToast,
} from "@ionic/react";

import { Link } from "react-router-dom";

import { chevronBackOutline } from "ionicons/icons";
import { useAuth } from "../../../../contexts";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { ErrorMessage } from "@hookform/error-message";
import supabase from "../../../../utils/supabase";

const LunchTime = () => {
  const { sessionUser } = useAuth();

  const [showToast] = useIonToast();

  const [editMode, setEditMode] = React.useState<boolean>(false);
  const [allTimes, setAllTimes] = React.useState<Array<any>>([]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [numberOfTheLastTime, setNumberOfTheLastTime] = React.useState<any>(
    sessionUser?.user_metadata?.lunch_time.length
  );

  const schema = Yup.object().shape({
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

  const handleGetLunchTimes = (data: any) => {
    let timeToGoOutSelected = `${data?.timeToGoOut}`;
    let timeToGoInSelected = `${data?.timeToGoIn}`;

    // separing the minut and hour of time selected
    let minsOfGoIn = timeToGoOutSelected.substring(data?.timeToGoOut.length, 3);
    let hoursOfGoOut = timeToGoOutSelected.substring(0, 2);
    let timesOfLunch: Array<string> = [];

    console.log(hoursOfGoOut);
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
    }

    handleSubmitLunchTimes(timesOfLunch);
  };

  const handleSubmitLunchTimes = async (LunchTimes: Array<string>) => {
    try {
      const { data, error } = await supabase
        .from("barbers")
        .update([{ lunch_time: LunchTimes }])
        .eq("id", sessionUser?.id);

      if (error) {
        await showToast({
          position: "top",
          message: error.message,
          duration: 3000,
        });
      }

      if (data) {
        handleUpdateLunchTimesInMetaData(LunchTimes);
      }
    } catch (error) {
      await showToast({
        position: "top",
        message: `${error}`,
        duration: 3000,
      });
    }
  };

  const handleUpdateLunchTimesInMetaData = async (data: any) => {
    try {
      const { user, error } = await supabase.auth.update({
        data: { lunch_time: data },
      });

      if (error) {
        await showToast({
          position: "top",
          message: error.message,
          duration: 3000,
        });
      }

      if (user) {
        await showToast({
          position: "top",
          message: "Alterado com sucesso",
          duration: 3000,
        }).then(() => {
          document.location.reload();
        });
      }
    } catch (error) {
      await showToast({
        position: "top",
        message: `${error}`,
        duration: 3000,
      });
    }
  };

  React.useEffect(() => {
    handleGerateAllTimes();
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

                <IonTitle className="font-bold">Meu almoço</IonTitle>
              </Link>
              <form
                onSubmit={handleSubmit(handleGetLunchTimes)}
                className="py-10 px-5"
              >
                <div className="bg-white rounded-3xl p-2 shadow-md">
                  <p className="text-center">Horário Cadastrado</p>
                  <p className=" absolute top-[210px] left-[189px]">às</p>
                  <div className="grid grid-cols-2 gap-5">
                    <div className="my-3">
                      <div className="flex justify-center items-center bg-gray-200 rounded-xl p-3 mt-3">
                        {editMode === false && (
                          <IonInput
                            type={"text"}
                            value={
                              sessionUser?.user_metadata?.lunch_time[0]
                                ? sessionUser?.user_metadata?.lunch_time[0]
                                : "Não Definido"
                            }
                            readonly={true}
                            className="placeholder: text-gray-900 text-center"
                          />
                        )}
                        {editMode && (
                          <IonSelect
                            className="bg-gray-200 rounded-3xl placeholder: text-gray-700 my-3 h-5"
                            placeholder={
                              sessionUser?.user_metadata?.lunch_time[0]
                                ? sessionUser?.user_metadata?.lunch_time[0]
                                : "hh:mm"
                            }
                            {...register("timeToGoOut")}
                          >
                            {allTimes.map((time, index) => (
                              <IonSelectOption key={index} value={time}>
                                {time}
                              </IonSelectOption>
                            ))}
                          </IonSelect>
                        )}
                      </div>
                      <ErrorMessage
                        errors={errors}
                        name="timeToGoOut"
                        as={<div style={{ color: "red" }} />}
                      />
                    </div>
                    <div className="my-3">
                      <div className="flex justify-center items-center bg-gray-200 rounded-xl p-3 mt-3">
                        {editMode === false && (
                          <IonInput
                            type={"text"}
                            value={
                              sessionUser?.user_metadata?.lunch_time[
                                numberOfTheLastTime - 1
                              ]
                                ? sessionUser?.user_metadata?.lunch_time[
                                    numberOfTheLastTime - 1
                                  ]
                                : "Não Definido"
                            }
                            readonly={true}
                            className="placeholder: text-gray-900 text-center"
                          />
                        )}
                        {editMode && (
                          <IonSelect
                            className="bg-gray-200 rounded-3xl placeholder: text-gray-700 my-3 h-5"
                            placeholder={
                              sessionUser?.user_metadata?.lunch_time[
                                numberOfTheLastTime - 1
                              ]
                                ? sessionUser?.user_metadata?.lunch_time[
                                    numberOfTheLastTime - 1
                                  ]
                                : "hh:mm"
                            }
                            {...register("timeToGoIn")}
                          >
                            {allTimes.map((time, index) => (
                              <IonSelectOption key={index} value={time}>
                                {time}
                              </IonSelectOption>
                            ))}
                          </IonSelect>
                        )}
                      </div>
                      <ErrorMessage
                        errors={errors}
                        name="timeToGoIn"
                        as={<div style={{ color: "red" }} />}
                      />
                    </div>
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
                  {editMode ? "Cancelar" : "Editar"}
                </div>

                {editMode && (
                  <button
                    type="submit"
                    className="flex justify-center p-4 w-full rounded-xl text-white my-5 bg-gradient-to-l from-green-800 to-green-700"
                  >
                    Salvar
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

export default LunchTime;
