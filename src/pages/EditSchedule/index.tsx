// @flow
import * as React from "react";

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
  useIonLoading,
  useIonRouter,
  useIonToast,
} from "@ionic/react";

import supabase from "../../utils/supabase";
import { useParams } from "react-router";
import { checkmarkCircle, chevronBackOutline, cut } from "ionicons/icons";

import { yupResolver } from "@hookform/resolvers/yup";
import "yup-phone";
import * as Yup from "yup";
import { useForm } from "react-hook-form";

import ScheduleImage from "../../assets/Schedule-Time.png";
import { useAuth } from "../../contexts";
import { Link } from "react-router-dom";
import { log } from "console";
import { ErrorMessage } from "@hookform/error-message";

export const EditSchedule = () => {
  const [showToast] = useIonToast();
  const [showLoading, hideLoading] = useIonLoading();

  const router = useIonRouter();
  const { sessionUser } = useAuth();
  //scheduleId
  const id: any = useParams();

  const [clientProfile, setClientProfile] = React.useState<Array<any> | null>();

  const [products, setProducts] = React.useState<Array<any>>([]);
  const [schedules, setSchedules] = React.useState<Array<any>>([]);

  const [status, setStatus] = React.useState<string>();
  const [openMarkAsDoneModal, setOpenMarkAsDoneModal] =
    React.useState<boolean>(false);
  const [openCancelScheduleModal, setOpenCancelScheduleModal] =
    React.useState<boolean>(false);

  const [totalValue, setTotalValue] = React.useState<number>(0);

  const schema = Yup.object().shape({
    products: Yup.array().default([]).nullable(),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const handleIsScheduleClientRegistered = async (client_name: any) => {
    try {
      let { data, error } = await supabase
        .from("clients")
        .select("*")

        .eq("username", client_name);

      if (error) {
        await showToast({
          position: "top",
          message: error.message,
          duration: 3000,
        });
        console.log(error);
      }

      //só seto no state se existir o cliente.
      if (data) {
        if (data.length !== 0) {
          setClientProfile(data);
        }
      }
    } catch (error) {}
  };

  const getSchedule = async () => {
    try {
      let { data, error } = await supabase
        .from("schedules")
        .select("*")

        .eq("id", id.scheduleId);

      if (error) {
        await showToast({
          position: "top",
          message: error.message,
          duration: 3000,
        });
        console.log(error);
      }

      if (data) {
        setSchedules(data);
        if (data[0].status === "done") {
          setStatus("done");
        } else if (data[0].status === "pending") {
          setStatus("pending");
        } else if (data[0].status === "canceled") {
          setStatus("canceled");
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

  const handleCancelSchedule = async () => {
    try {
      let { data, error } = await supabase
        .from("schedules")
        .update({ status: "canceled" })

        .eq("id", id.scheduleId);

      if (error) {
        await showToast({
          position: "top",
          message: error.message,
          duration: 3000,
        });
        console.log(error);
      }

      if (data) {
        setStatus("canceled");
        await showToast({
          position: "top",
          message: "Status alterado com sucesso",
          duration: 3000,
        });
        document.location.replace("/app/calendar");
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

  const getProducts = async () => {
    try {
      let { data: products, error } = await supabase
        .from("products")
        .select("*");

      if (error) {
        await showToast({
          position: "top",
          message: error.message,
          duration: 3000,
        });
      }

      if (products) {
        await setProducts(products);
      }
    } catch (error) {
      await showToast({
        position: "top",
        message: `${error}`,
        duration: 3000,
      });
    }
  };

  const handleCashFlowIn = async (data: any) => {
    console.log("here");

    await showLoading();
    try {
      const { data: cashFlowData, error } = await supabase
        .from("cashFlow")
        .insert([
          {
            barber_id: sessionUser?.id,
            schedule_id: schedules[0]?.id,
            client_name: schedules[0]?.name,
            services: schedules[0]?.services,
            products: data?.products,
            total_value: totalValue > 0 ? totalValue : schedules[0]?.price,
          },
        ]);

      if (cashFlowData) {
        handleMarkAsDone();
      }
      if (error) {
        await showToast({
          position: "top",
          message: error.message,
          duration: 3000,
        });
        hideLoading();
        console.log(error);
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

  const handleMarkAsDone = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data, error } = await supabase
        .from("schedules")
        .update({ status: "done" })
        .eq("id", schedules[0]?.id);

      if (data) {
        await showToast({
          position: "top",
          message: "Agendamento Finalizado com sucesso",
          duration: 3000,
        });
        document.location.replace("/app/calendar");
      }

      if (error) {
        await showToast({
          position: "top",
          message: error.message,
          duration: 3000,
        });
        hideLoading();
        console.log(error);
      }
    } catch (error) {
      await showToast({
        position: "top",
        message: `${error}`,
        duration: 3000,
      });
      console.log(error);
    } finally {
      await hideLoading();
    }
  };

  React.useEffect(() => {
    getSchedule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    getProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    console.log(schedules[0]?.name);
    handleIsScheduleClientRegistered(schedules[0]?.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schedules]);

  return (
    <IonPage>
      <IonContent>
        {sessionUser && (
          <>
            <Link
              to="/app/calendar"
              className="flex items-center bg-white p-5 border-b h-24"
            >
              <IonIcon className="w-6 h-6" src={chevronBackOutline} />

              <IonIcon
                className={`w-7 h-7 ml-5 ${
                  status === "done"
                    ? "text-green-700"
                    : status === "pending"
                    ? "text-orange-700"
                    : "text-red-700"
                }`}
                src={checkmarkCircle}
              />
              <IonTitle className="-ml-3 font-bold">Agendamento</IonTitle>
            </Link>
            <img src={ScheduleImage} alt="" />
            <div className="ion-padding">
              <div
                onClick={() => {
                  clientProfile?.length === 0
                    ? router.push(`/app/profile/${clientProfile[0]?.id}`)
                    : console.log("client not registred");
                }}
                className="flex items-center bg-gray-200 rounded-xl p-3 mt-3"
              >
                <IonInput
                  id="name"
                  type="text"
                  className=""
                  readonly={true}
                  value={schedules.length > 0 ? schedules[0].name : "Error"}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="my-3 col-span-2">
                  <div
                    id="date"
                    className="flex items-center bg-gray-200 rounded-xl p-3 mt-3"
                  >
                    <IonInput
                      type={"text"}
                      readonly={true}
                      value={schedules.length > 0 ? schedules[0].date : "error"}
                      className="placeholder: text-gray-900"
                    />
                  </div>
                </div>

                <div id="price" className="my-3">
                  <div className="flex items-center bg-gray-200 rounded-xl p-3 mt-3">
                    <IonInput
                      type={"text"}
                      readonly={true}
                      value={
                        schedules.length > 0
                          ? "R$ " + schedules[0]?.price
                          : "error"
                      }
                      className="placeholder: text-gray-900"
                    />
                  </div>
                </div>
              </div>
              <p className=" flex justify-center items-center">às</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="my-3">
                  <div className="flex items-center bg-gray-200 rounded-xl p-3 mt-3">
                    <IonInput
                      type={"text"}
                      readonly={true}
                      value={
                        schedules.length > 0 ? schedules[0].times[0] : "error"
                      }
                      className="placeholder: text-gray-900"
                    />
                  </div>
                </div>
                <div className="my-3">
                  <div className="flex items-center bg-gray-200 rounded-xl p-3 mt-3">
                    <IonInput
                      type={"text"}
                      value={
                        schedules.length > 0
                          ? schedules[0].times[schedules[0]?.times.length - 1]
                          : "error"
                      }
                      readonly={true}
                      className="placeholder: text-gray-900 text-center uppercase "
                    />
                  </div>
                </div>
              </div>

              {status === "pending" && (
                <>
                  {sessionUser?.user_metadata?.barber && (
                    <button
                      onClick={() => {
                        setOpenMarkAsDoneModal(!openMarkAsDoneModal);
                      }}
                      className={`p-4 w-full rounded-xl bg-gradient-to-l from-orange-800 to-orange-600 text-white my-3`}
                    >
                      Marcar como Finalizado
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setOpenCancelScheduleModal(!openCancelScheduleModal);
                    }}
                    className={
                      "p-4 w-full rounded-xl bg-gradient-to-l from-red-500 to-red-700 text-white my-3"
                    }
                  >
                    Cancelar Agendamento
                  </button>
                </>
              )}
              {status === "canceled" && (
                <div className="flex justify-center items-center w-full rounded-3xl shadow bg-red-500 p-10 uppercase text-white">
                  <IonLabel className="text-center">
                    Este agendamento foi Cancelado
                  </IonLabel>
                </div>
              )}
            </div>

            {/* =============================== MODAL ================================= */}
            <IonModal
              isOpen={openMarkAsDoneModal}
              initialBreakpoint={0.85}
              breakpoints={[0, 0.75, 0.85, 0.9, 1]}
            >
              <div className="flex justify-around p-3 bg-gradient-to-l from-green-800 to-green-600 ">
                <IonTitle className="text-white">
                  Marcar como finalizado
                </IonTitle>
                <div className="p-2">
                  <button
                    onClick={() => setOpenMarkAsDoneModal(!openMarkAsDoneModal)}
                    className="ml-2 text-white"
                  >
                    FECHAR
                  </button>
                </div>
              </div>

              <div className="ion-padding">
                <div
                  id="SERVICES"
                  className="w-full h-auto shadow rounded-3xl py-5 bg-red"
                >
                  <div className="flex justify-start items-center mx-5">
                    <IonIcon className="text-black w-6 h-6" src={cut} />
                    <IonText className="ml-2 text-gray-500">Serviços</IonText>
                  </div>
                  <div className="flex justify-center">
                    <div className="h-[1px] w-4/5 bg-gray-500" />
                  </div>
                  <IonList className="w-full h-full p-5 rounded-3xl bg-transparent">
                    {schedules[0]?.services.map((service: any, index: any) => (
                      <div key={index} className="grid grid-cols-2 w-full py-2">
                        <IonLabel className="text-gray-500 col-span-2">
                          {service}
                        </IonLabel>
                        {/* <div className="flex justify-end items-center">
                      <IonLabel className="mr-3 text-gray-500">R$20</IonLabel>
                    </div> */}
                      </div>
                    ))}
                  </IonList>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div id="DESCONTO" className="my-3 col-span-2">
                    <IonLabel className="text-gray-500 ">DESCONTO</IonLabel>
                    <div className="flex items-center bg-gray-200 rounded-xl p-3 mt-3">
                      <IonInput
                        onIonChange={(e) => {
                          console.log(e.target.value);
                          setTotalValue(
                            schedules[0]?.price - Number(e.target.value)
                          );
                        }}
                        type={"number"}
                        step="0.01"
                        placeholder="Valor do desconto"
                        className="placeholder: text-gray-900"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div id="NAME" className="my-3 col-span-2">
                    <IonLabel className="text-gray-500 ">Nome</IonLabel>
                    <div className="flex items-center bg-gray-200 rounded-xl p-3 mt-3">
                      <IonInput
                        type={"text"}
                        readonly={true}
                        value={
                          schedules.length > 0 ? schedules[0].name : "Error"
                        }
                        className="placeholder: text-gray-900"
                      />
                    </div>
                  </div>
                  <div id="price" className="my-3">
                    <IonLabel className="text-gray-500 ">Valor Total</IonLabel>
                    <div className="flex items-center bg-gray-200 rounded-xl p-3 mt-3">
                      <IonInput
                        type={"text"}
                        readonly={true}
                        className="placeholder: text-gray-900"
                        value={
                          totalValue > 0
                            ? "R$" + totalValue.toFixed(2)
                            : "R$" + schedules[0]?.price.toFixed(2)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <form
                onSubmit={handleSubmit(handleCashFlowIn)}
                className="ion-padding"
              >
                <IonSelect
                  id="PRODUCTS"
                  onIonChange={({ detail }) => {
                    let data: Array<any> = detail.value;
                    let total = 0;
                    for (let i = 0; i < data.length; i++) {
                      for (let y = 0; y < products.length; y++) {
                        if (data[i] === products[y]?.name) {
                          total += products[y].price;
                        }
                      }
                    }
                    if (totalValue > 0) {
                      total += totalValue;
                    } else {
                      total += schedules[0]?.price;
                    }
                    setTotalValue(total);
                  }}
                  multiple={true}
                  className="bg-gray-200 rounded-3xl placeholder: text-gray-800 my-3 h-14"
                  placeholder="Comprou/consumiu produtos"
                  {...register("products")}
                >
                  {products.map((product, index) => (
                    <IonSelectOption key={index} value={product?.name}>
                      {product?.name}
                    </IonSelectOption>
                  ))}
                </IonSelect>
                <ErrorMessage
                  errors={errors}
                  name="products"
                  as={<div style={{ color: "red" }} />}
                />

                <button
                  type="submit"
                  onClick={() => {
                    console.log("asd");
                  }}
                  className="p-4 w-full rounded-3xl text-white my-5 bg-gradient-to-l from-green-800 to-green-700"
                >
                  CONFIRMAR
                </button>
              </form>
            </IonModal>

            {/* CONFIRM MODAL TO CANCEL SCHEDULE */}

            <IonModal
              isOpen={openCancelScheduleModal}
              initialBreakpoint={0.3}
              breakpoints={[0, 0.3, 0.5, 0.65, 1]}
            >
              <div className="flex justify-around p-3 bg-gradient-to-l from-green-800 to-green-600">
                <IonTitle className="text-white">
                  Cancelar esse agendamento?
                </IonTitle>
                <div className="p-2">
                  <button
                    onClick={() =>
                      setOpenCancelScheduleModal(!openCancelScheduleModal)
                    }
                    className="text-white"
                  >
                    FECHAR
                  </button>
                </div>
              </div>
              <div className="ion-padding">
                <IonLabel className="text-gray-400 my-3">
                  O cancelamento é irreversivél, após cancelalo não terá como
                  desfazer essa ação, sendo necessário refazer o agendamento
                  caso tenha cancelado por engano.
                </IonLabel>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleCancelSchedule}
                    className={
                      "p-4 w-full rounded-xl bg-gradient-to-l from-green-500 to-green-700 text-white my-3"
                    }
                  >
                    Confirmar
                  </button>
                  <button
                    onClick={() => {
                      setOpenCancelScheduleModal(false);
                    }}
                    className={
                      "p-4 w-full rounded-xl bg-gradient-to-l from-red-500 to-red-700 text-white my-3"
                    }
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </IonModal>
          </>
        )}{" "}
        {sessionUser === null && (
          <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
            <p className="text-black">
              você precisa estar logado como profissional
            </p>
            <Link to="/signup" className="text-cyan-500">
              Clique aqui
            </Link>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};
