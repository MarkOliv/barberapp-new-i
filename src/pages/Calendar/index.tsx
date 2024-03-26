import {
  IonContent,
  IonIcon,
  IonInput,
  IonLabel,
  IonList,
  IonModal,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTitle,
  useIonToast,
} from "@ionic/react";
import {
  alarm,
  calendar,
  checkmarkCircle,
  chevronBackOutline,
  time,
} from "ionicons/icons";
import React from "react";

import { Link } from "react-router-dom";
import supabase from "../../utils/supabase";

import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import "yup-phone";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { useAuth } from "../../contexts";
import blocked_times from "../../utils/types";

const Calendar = () => {
  const [showToast] = useIonToast();
  const { sessionUser } = useAuth();

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const [allTimes, setAllTimes] = React.useState<Array<string>>([]);
  const [AllAvailebleTimes, setallAvailebleTimesF] = React.useState<
    Array<string>
  >([]);

  const [allServices, setAllServices] = React.useState<Array<any>>([]);

  const [allBarbers, setAllBarbers] = React.useState<Array<any>>([]);
  const [selectedBarber, setSelectedBarber] = React.useState<any>();

  const [lunchTimes, setLunchTimes] = React.useState<Array<any>>([]);

  const [blockedTimes, setBlockedTimes] = React.useState<Array<blocked_times>>(
    []
  );

  // Handling states to show the consult
  const [consultDate, setConsultDate] = React.useState<any>();
  const [schedulesOfConsult, setSchedulesOfConsult] = React.useState<
    Array<any>
  >([]);

  const barberSchema = Yup.object().shape({
    name: Yup.string(),
    phone: Yup.string(),
    // .phone(
    //   "BR",
    //   false,
    //   "insira um numero de telefone válido"
    // ),
    barber: Yup.object().required("O Barbeiro é obrigatório"),
    service: Yup.array().required("Selecione pelo menos um serviço"),
    date: Yup.string().required("A data é obrigatória"),
    time: Yup.string().required("Informe qual horário"),
  });

  const {
    handleSubmit: handleSubmitBarber,
    register,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(barberSchema),
  });

  const getSchedulesOfConsult = async (date: any) => {
    try {
      if (sessionUser?.user_metadata?.barber) {
        let { data, error } = await supabase
          .from("schedules")
          .select("*")

          .eq("date", date)
          .eq("barber_id", sessionUser?.id)
          .neq("status", "canceled");

        if (error) {
          await showToast({
            position: "top",
            message: error.message,
            duration: 3000,
          });
          console.log(error);
        }

        if (data) {
          setSchedulesOfConsult(data);
        }
      } else {
        let { data, error } = await supabase
          .from("schedules")
          .select("*")

          .eq("date", date)
          .eq("name", sessionUser?.user_metadata?.full_name);

        if (error) {
          await showToast({
            position: "top",
            message: error.message,
            duration: 3000,
          });
          console.log(error);
        }

        if (data) {
          setSchedulesOfConsult(data);
        }
      }
    } catch (error) {
      await showToast({
        position: "top",
        message: `${error}`,
        duration: 3000,
      });
      console.log(error);
    }
  };

  const getAllServices = async () => {
    try {
      let { data: services, error } = await supabase
        .from("services")
        .select("*");

      if (error) {
        await showToast({
          position: "top",
          message: error.message,
          duration: 3000,
        });
      }

      if (services) {
        setAllServices(services);
      }
    } catch (error) {
      await showToast({
        position: "top",
        message: `${error}`,
        duration: 3000,
      });
      console.log(error);
    }
  };

  const getAllBarbers = async () => {
    try {
      let { data: barbers, error } = await supabase
        .from("barbers")
        .select("*")
        .eq("off_work", false);

      if (error) {
        await showToast({
          position: "top",
          message: error.message,
          duration: 3000,
        });
      }

      if (barbers) {
        setAllBarbers(barbers);
      }
    } catch (error) {
      await showToast({
        position: "top",
        message: `${error}`,
        duration: 3000,
      });
      console.log(error);
    }
  };

  const handleGenerateAllTimes = () => {
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

        if (h === 19 && m === 45) {
          allTimes.push(`20:00`);
        }
      }
    }

    setAllTimes(allTimes);
  };

  const getAllAvailebleTimesF = (
    timesAlreadyScheduled: Array<any>,
    chosenDate: string
  ) => {
    let allAvailebleTimesF: Array<string> = allTimes;

    //inserir os horarios dos bloqueios aqui
    for (let i = 0; i < blockedTimes.length; i++) {
      for (let j = 0; j < blockedTimes[i]?.dates_blocked_times.length; j++) {
        if (blockedTimes[i].dates_blocked_times[j] === chosenDate) {
          for (let y = 0; y < blockedTimes[i]?.blocked_times.length; y++) {
            timesAlreadyScheduled.push(blockedTimes[i]?.blocked_times[y]);
          }
          break;
        }
      }
    }

    // lunchTimes.pop(); // lunch its from the first time to the last. so the last dont count, that's why i'm doing the pop().

    // eslint-disable-next-line array-callback-return
    console.log(lunchTimes);
    lunchTimes.map((time) => {
      // console.log(time);
      timesAlreadyScheduled.push(time);
    });

    // removing already times scheduleds | lunch times and blocked times
    // eslint-disable-next-line array-callback-return
    timesAlreadyScheduled.map((time: string) => {
      let currentTime = time.substring(0, 5); //valor original = 00:00:00 estou deixando como 00:00
      let index = allAvailebleTimesF.findIndex((v) => v === currentTime);
      allAvailebleTimesF.splice(index, 1);
    });

    setallAvailebleTimesF(allAvailebleTimesF);
  };

  const handleTimes = (data: any) => {
    // getting total minuts of all selected services
    let services = data?.service;

    let servicesNames: Array<any> = [];
    let totalPriceServices = 0;
    let totalTimesServices = 0;

    // eslint-disable-next-line array-callback-return
    services.map((service: any) => {
      totalTimesServices += service?.time;
      servicesNames.push(service?.name);
      totalPriceServices += service?.price;
    });

    //fazer com switch case
    //este contador é usado para saber quantos horários (de 15 minutos) os serviços agendados vão utilizar
    // como por exemplo, mais de 255 minutos (4 horas) utilizará o equivalente a 17 horarios
    let count = 0;

    if (totalTimesServices > 300) {
      count = 21;
    } else if (totalTimesServices > 285) {
      count = 20;
    } else if (totalTimesServices > 270) {
      count = 19;
    } else if (totalTimesServices > 255) {
      count = 18;
    } else if (totalTimesServices > 240) {
      count = 17;
    } else if (totalTimesServices > 225) {
      count = 16;
    } else if (totalTimesServices > 210) {
      count = 15;
    } else if (totalTimesServices > 195) {
      count = 14;
    } else if (totalTimesServices > 180) {
      count = 13;
    } else if (totalTimesServices > 165) {
      count = 12;
    } else if (totalTimesServices > 150) {
      count = 11;
    } else if (totalTimesServices > 135) {
      count = 10;
    } else if (totalTimesServices > 120) {
      count = 9;
    } else if (totalTimesServices > 105) {
      count = 8;
    } else if (totalTimesServices > 90) {
      count = 7;
    } else if (totalTimesServices > 75) {
      count = 6;
    } else if (totalTimesServices > 60) {
      count = 5;
    } else if (totalTimesServices > 45) {
      count = 4;
    } else if (totalTimesServices > 30) {
      count = 3;
    } else if (totalTimesServices > 15) {
      count = 2;
    } else if (totalTimesServices == 15) {
      count = 1;
    }

    // pegando os horarios que os serviços vao ocupar
    // separing the minut and hour of time selected
    let minutsTimeSelected: string = data.time.substring(data.time.length, 3);
    let hourTimeSelected: string = data.time.substring(0, 2);

    let y = 0;
    let h = Number(hourTimeSelected); //horas
    let allBusyTimeservices = []; //conterá todos os horários que os serviços selecionados ocupam

    // minutos são usados para iniciar a contagem, se a hora selecionada foi hh:15 preciso começar de 15 minutos
    // o 'm' são os minutos usados para montar as horas, que varia de 15 em 15
    for (let m = Number(minutsTimeSelected); count >= y; m += 15) {
      y++; //é o contador que controla o for

      // se os minutos forem maiores ou iguais a 60 eu aumento uma hora e zero os minutos pois nesse momento teremos uma hora exata como 09:00, sendo necessário zerar os minutos para que recomece a contagem de 15 em 15
      if (m >= 60) {
        h++;
        m = 0;
        // apenas lidando com a posição do zero em horas
        if (h >= 10) {
          allBusyTimeservices.push(`${h}:00`);
        } else {
          allBusyTimeservices.push(`0${h}:00`);
        }
      } else {
        // apenas lidando com a posição dos zeros tanto em horas quanto em minutos por não se tratar de um horário exato
        if (h >= 10) {
          if (m < 0) {
            allBusyTimeservices.push(`${h}:0${m}`);
          } else {
            allBusyTimeservices.push(`${h}:${m}`);
          }
        } else if (m < 10) {
          allBusyTimeservices.push(`0${h}:0${m}`);
        } else {
          allBusyTimeservices.push(`0${h}:${m}`);
        }
      }
    }

    // comparando todos os horarios que os serviços selecionados ocupam(allBusyTimeservices) com todos os horarios disponiveis(allAvailebleTimesF).

    // se caso algum horário do allBusyTimeservices não bater com o allAvailebleTimesF, Não é perimitido o agendamento, pois isso significa que um horário vai sobrepor outro
    let countAvaibleTimes = 1;
    for (let index = 0; index < allBusyTimeservices.length; index++) {
      for (let y = 0; y < AllAvailebleTimes.length; y++) {
        if (allBusyTimeservices[index] === AllAvailebleTimes[y]) {
          countAvaibleTimes++;
        }
      }
    }
    // todos os horários(allBusyTimeservices) devem estar disponiveis nos horarios disponiveis (allAvailebleTimesF)
    console.log(allBusyTimeservices);
    console.log(AllAvailebleTimes);

    console.log(countAvaibleTimes);

    // eslint-disable-next-line eqeqeq
    if (allBusyTimeservices.length <= countAvaibleTimes) {
      handleCreateSchedule(
        sessionUser?.user_metadata?.barber
          ? data.name === ""
            ? "sem nome"
            : data.name
          : sessionUser?.user_metadata?.full_name,
        data.phone === "" ? null : data.phone,
        servicesNames,
        data.date,
        allBusyTimeservices,
        data.barber?.id,
        totalPriceServices
      );
    } else {
      showToast({
        position: "top",
        message: `Horário indisponível para o(os) 'serviço(os) escolhidos. tempo necessário é de ${totalTimesServices} minutos`,
        duration: 5000,
      });
    }
  };

  const handleCreateSchedule = async (
    client_name: string,
    client_phone: number,
    servicesSelected: Array<any>,
    date: string,
    times: Array<any>,
    barber_id: any,
    price: number
  ) => {
    try {
      const { data: newSchedule, error } = await supabase
        .from("schedules")
        .insert([
          {
            name: client_name,
            phone: client_phone,
            services: servicesSelected,
            date: date,
            times: times,
            barber_id: barber_id,
            price: price,
          },
        ]);

      if (error) {
        await showToast({
          position: "top",
          message: error.message,
          duration: 3000,
        });
      }

      if (newSchedule) {
        await showToast({
          position: "top",
          message: "Agendado com sucesso",
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
      console.log(error);
    }
  };

  const handleGetAllBlocks = async () => {
    try {
      let { data: block_times, error } = await supabase
        .from("block_times")
        .select("*");

      if (block_times) {
        block_times.map((block) => {
          let blockT: blocked_times = {
            id: block?.id,
            nome: block?.nome,
            created_at: block?.created_at,
            blocked_times: block?.blocked_times,
            dates_blocked_times: block?.dates_blocked_times,
          };
          setBlockedTimes((current) => [...current, blockT]);
        });
      }
    } catch (error) {}
  };

  // chamado por um onChange
  const handleGetAlreadyScheduled = async (newDate: any) => {
    try {
      handleGenerateAllTimes();
      setallAvailebleTimesF([]);
      let { data, error } = await supabase
        .from("schedules")
        .select("*")

        .eq("date", newDate)
        .eq("barber_id", selectedBarber?.id)
        .neq("status", "canceled")
        .neq("status", "done");

      if (error) {
        await showToast({
          position: "top",
          message: error.message,
          duration: 3000,
        });
        console.log(error);
      }

      if (data) {
        let timesAlreadyScheduled: Array<any>;
        timesAlreadyScheduled = [];
        // eslint-disable-next-line array-callback-return
        data.map((schedule) => {
          // eslint-disable-next-line array-callback-return
          schedule?.times.map((time: any) => {
            timesAlreadyScheduled.push(time);
          });
        });
        getAllAvailebleTimesF(timesAlreadyScheduled, newDate);
      }
    } catch (error) {
      await showToast({
        position: "top",
        message: `${error}`,
        duration: 3000,
      });
      console.log(error);
    }
  };

  React.useEffect(() => {
    getAllServices();
    getAllBarbers();
    handleGetAllBlocks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    setLunchTimes(selectedBarber?.lunch_time);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBarber]);

  React.useEffect(() => {
    handleGenerateAllTimes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <IonPage>
      {sessionUser && (
        <IonContent>
          <Link
            to="/app/home"
            className="flex items-center bg-white p-5 border-b h-24"
          >
            <IonIcon className="w-6 h-6" src={chevronBackOutline} />

            <IonTitle className="font-bold">Calendário</IonTitle>
          </Link>
          <div className="h-screen py-10 px-5 bg-gray-100">
            <div className={`grid grid-cols-[30%_1fr] gap-4 py-3`}>
              <div
                onClick={() => setIsModalOpen(!isModalOpen)}
                className="flex flex-col justify-center items-center h-32 shadow-md rounded-3xl bg-gradient-to-l from-green-800 to-green-600"
              >
                <IonIcon className="mb-5 w-8 h-8 text-white" src={alarm} />

                <IonText className="text-white">Agendar</IonText>
              </div>

              <>
                <div className="flex flex-col justify-center items-center h-32 bg-white shadow-md rounded-3xl p-3">
                  <IonText className="text-gray-500 mb-2">
                    Consultar Agendamentos
                  </IonText>
                  <div className="flex justify-center items-center bg-gray-200 rounded-3xl shadow-md h-10 w-full">
                    <IonIcon className="ml-3 text-gray-500" src={calendar} />
                    <IonInput
                      className="text-gray-500"
                      placeholder="dd/mm/aaaa"
                      type="date"
                      onIonChange={({ detail }) => {
                        setConsultDate(detail.value);
                        getSchedulesOfConsult(detail.value);
                      }}
                    />
                  </div>
                </div>
              </>
            </div>

            <div className="h-auto w-full bg-white shadow-md rounded-3xl py-5">
              <div className="flex justify-start mx-5">
                <IonIcon className="mb-5 w-6 h-6 text-gray-500" src={time} />
                <IonText className="ml-2 text-gray-500">
                  {consultDate ? consultDate : "ano/mês/dia"}
                </IonText>
              </div>
              <div className="flex justify-center">
                <div className="h-[1px] w-4/5 bg-gray-500" />
              </div>
              <IonList className="w-full h-full p-5 rounded-3xl">
                {schedulesOfConsult.map((agendamento, index) => (
                  <div
                    onClick={() => {
                      document.location.replace(
                        `/app/edit-schedule/${agendamento.id}`
                      );
                    }}
                    key={index}
                    className="grid grid-cols-3 w-full py-2"
                  >
                    <div className="flex justify-start items-center">
                      <IonIcon
                        className={`w-7 h-7 ${
                          agendamento.status === "pending"
                            ? "text-orange-700"
                            : agendamento.status === "done"
                            ? "text-green-700"
                            : "text-red-700"
                        }`}
                        src={checkmarkCircle}
                      />
                    </div>
                    <IonLabel className="text-gray-500">
                      {agendamento.name}
                    </IonLabel>
                    <div className="flex justify-end items-center">
                      <IonLabel className="mr-3 text-gray-500">
                        {agendamento.times[0]}
                      </IonLabel>
                    </div>
                  </div>
                ))}
              </IonList>
            </div>
          </div>
          <IonModal
            isOpen={isModalOpen}
            initialBreakpoint={0.85}
            breakpoints={[0, 0.75, 0.85, 0.9, 1]}
          >
            <div className="flex justify-around p-3 bg-gradient-to-l from-green-800 to-green-600">
              <IonTitle className="text-white">Fazer Agendamento</IonTitle>
              <div className="p-2">
                <button
                  onClick={() => setIsModalOpen(!isModalOpen)}
                  className="ml-2 text-white"
                >
                  FECHAR
                </button>
              </div>
            </div>
            <form
              onSubmit={handleSubmitBarber(handleTimes)}
              className="ion-padding"
            >
              {sessionUser?.user_metadata?.barber && (
                <>
                  <IonLabel className="text-gray-600" position="stacked">
                    Nome
                  </IonLabel>
                  <div className="flex items-center bg-gray-200 rounded-3xl p-3 mt-1">
                    <IonInput
                      type="text"
                      className="placeholder: text-gray-600"
                      placeholder="José da Silva"
                      {...register("name")}
                    />
                  </div>
                  <ErrorMessage
                    errors={errors}
                    name="name"
                    as={<div style={{ color: "red" }} />}
                  />
                </>
              )}
              <IonLabel className="text-gray-600" position="stacked">
                Numero de telefone
              </IonLabel>
              <div className="flex items-center bg-gray-200 rounded-3xl p-3 mt-1">
                <IonInput
                  type="text"
                  className="placeholder: text-gray-600"
                  placeholder="(16)99111-1111"
                  {...register("phone")}
                />
              </div>
              <ErrorMessage
                errors={errors}
                name="phone"
                as={<div style={{ color: "red" }} />}
              />
              <IonLabel className="text-gray-600" position="stacked">
                Barbeiro
              </IonLabel>
              <IonSelect
                className="bg-gray-200 rounded-3xl placeholder: text-gray-700 my-3"
                placeholder="Selecione o Barbeiro"
                onIonChange={({ detail }) => {
                  setSelectedBarber(detail.value);
                }}
                {...register("barber")}
              >
                {allBarbers &&
                  allBarbers.map((barber, index) => (
                    <IonSelectOption key={index} value={barber}>
                      {barber?.username}
                    </IonSelectOption>
                  ))}
              </IonSelect>
              <ErrorMessage
                errors={errors}
                name="barber"
                as={<div style={{ color: "red" }} />}
              />
              <IonLabel className="text-gray-600" position="stacked">
                Serviços
              </IonLabel>
              <IonSelect
                multiple={true}
                className="bg-gray-200 rounded-3xl placeholder: text-gray-700 my-3"
                placeholder="Selecione os serviços.."
                {...register("service")}
              >
                {allServices &&
                  allServices.map((service, index) => (
                    <IonSelectOption
                      key={index}
                      value={{
                        id: service?.id,
                        name: service?.name,
                        time: service?.time,
                        price: service?.price,
                      }}
                    >
                      {service?.name}
                    </IonSelectOption>
                  ))}
              </IonSelect>
              <ErrorMessage
                errors={errors}
                name="service"
                as={<div style={{ color: "red" }} />}
              />

              <IonLabel className="text-gray-600" position="stacked">
                Data
              </IonLabel>
              <div className="flex justify-center items-center bg-gray-200 rounded-3xl shadow-md h-10 w-full my-3">
                <IonInput
                  onIonChange={({ detail }) => {
                    let data = detail.value;
                    handleGetAlreadyScheduled(data);
                  }}
                  className="text-gray-500"
                  type="date"
                  {...register("date")}
                />
              </div>
              <ErrorMessage
                errors={errors}
                name="date"
                as={<div style={{ color: "red" }} />}
              />
              <IonSelect
                className="bg-gray-200 rounded-3xl placeholder: text-gray-700 my-3"
                placeholder="Selecione o horário..."
                {...register("time")}
              >
                {AllAvailebleTimes.map((time, index) => (
                  <span key={index}>
                    {time !== "20:00" && (
                      <IonSelectOption key={index} value={time}>
                        {time}
                      </IonSelectOption>
                    )}
                  </span>
                ))}
              </IonSelect>
              <ErrorMessage
                errors={errors}
                name="time"
                as={<div style={{ color: "red" }} />}
              />
              <button
                type="submit"
                className="p-4 w-full rounded-3xl text-white my-5 shadow-md bg-gradient-to-l from-green-800 to-green-700"
              >
                AGENDAR
              </button>
            </form>
          </IonModal>
        </IonContent>
      )}
      {sessionUser === undefined && (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
          <p className="text-black">você precisa estar logado</p>
          <Link to="/signup" className="text-cyan-500">
            Clique aqui
          </Link>
        </div>
      )}
    </IonPage>
  );
};

export default Calendar;
