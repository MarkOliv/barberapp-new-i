// @flow
import * as React from "react";

import {
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTitle,
  useIonToast,
} from "@ionic/react";

import { Link } from "react-router-dom";

import { calendar, chevronBackOutline } from "ionicons/icons";
import { useAuth } from "../../../../contexts";

import supabase from "../../../../utils/supabase";

const NumberClientsMonth = () => {
  const [consultDate, setConsultDate] = React.useState<any>();
  const [allCashFlow, setAllCashFlow] = React.useState<Array<any>>([]);
  const [consultDateCashFlow, setConsultDateAllCashFlow] = React.useState<
    Array<any>
  >([]);

  const [numberOfClients, setNumberOfClients] = React.useState<Number>();

  const [barbers, setBarbers] = React.useState<Array<any>>([]);
  const [selectedBarber, setSelectedBarber] = React.useState<any>();

  const { sessionUser } = useAuth();
  const [showToast] = useIonToast();

  const handleGetAllCashFlow = async () => {
    try {
      if (selectedBarber !== "nenhum" && selectedBarber !== undefined) {
        let { data: cashFlow, error } = await supabase
          .from("cashFlow")
          .select("*")

          .eq("barber_id", selectedBarber);

        if (cashFlow) {
          setAllCashFlow(cashFlow);
        }

        if (error) {
          await showToast({
            position: "top",
            message: error.message,
            duration: 3000,
          });
        }
      } else {
        let { data: cashFlow, error } = await supabase
          .from("cashFlow")
          .select("*");

        if (cashFlow) {
          setAllCashFlow(cashFlow);
        }

        if (error) {
          await showToast({
            position: "top",
            message: error.message,
            duration: 3000,
          });
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

  const handleFilterDate = async () => {
    setConsultDateAllCashFlow([]);
    try {
      allCashFlow?.map((cashFlow) => {
        let date = `${cashFlow?.created_at}`;
        if (date?.includes(consultDate)) {
          setConsultDateAllCashFlow((current) => [...current, cashFlow]);
        }
      });
    } catch (error) {}
  };

  //im counting clients by cashflows credit type
  const handleCountClients = () => {
    try {
      let creditTotalCount = 0;

      consultDateCashFlow.map((cashFlow) => {
        if (cashFlow?.type === "credit") {
          creditTotalCount += 1;
        }
      });
      setNumberOfClients(Number(creditTotalCount.toFixed(2)));
    } catch (error) {
      console.log(error);
      showToast({
        position: "top",
        message: `${error}`,
        duration: 3000,
      });
    }
  };

  const handleGetBarbers = async () => {
    try {
      let { data: barbers, error } = await supabase.from("barbers").select("*");

      if (error) {
        await showToast({
          position: "top",
          message: error.message,
          duration: 3000,
        });
      }

      if (barbers) {
        setBarbers(barbers);
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
    handleGetBarbers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    handleFilterDate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allCashFlow, consultDate]);

  React.useEffect(() => {
    handleCountClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consultDateCashFlow]);

  return (
    <IonPage>
      <IonContent>
        {sessionUser && (
          <>
            <div className="h-screen bg-gray-100">
              <Link
                to="/app/config/reports"
                className="flex items-center bg-white p-5 border-b h-24"
              >
                <IonIcon className="w-6 h-6" src={chevronBackOutline} />

                <IonTitle className="font-bold">
                  Numero de clientes mês
                </IonTitle>
              </Link>

              <div className="py-10 px-5">
                <div className="flex flex-wrap justify-center items-center mt-5 mb-3 p-3 bg-white rounded-3xl shadow h-auto">
                  <p>Selecione a data</p>
                  <div className="flex justify-center items-center bg-gray-200 rounded-3xl shadow-md h-10 w-full">
                    <IonInput
                      className="text-gray-500"
                      placeholder="mm/aaaa"
                      type={"month"}
                      onIonChange={({ detail }) => {
                        setConsultDate(detail?.value);
                      }}
                    />
                    <IonIcon className="mr-5 text-gray-500" src={calendar} />
                  </div>

                  <IonSelect
                    className="w-full bg-gray-200 rounded-3xl placeholder: text-gray-700 my-3"
                    placeholder="Selecione o Barbeiro"
                    onIonChange={({ detail }) => {
                      setSelectedBarber(detail.value);
                      // console.log(detail.value);
                    }}
                  >
                    <IonSelectOption key={"nenhum"} value={"nenhum"}>
                      Nenhum Barbeiro
                    </IonSelectOption>
                    {barbers &&
                      barbers.map((barber, index) => (
                        <IonSelectOption key={index} value={barber?.id}>
                          {barber?.username}
                        </IonSelectOption>
                      ))}
                  </IonSelect>

                  <button
                    onClick={() => {
                      handleGetAllCashFlow();
                    }}
                    className="p-4 w-full rounded-3xl text-white my-5 shadow-md bg-gradient-to-l from-green-800 to-green-700"
                  >
                    Buscar
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <IonItem
                    className="mt-5 mb-3 bg-white rounded-3xl shadow shadow-green-500 h-20 flex items-center"
                    lines="none"
                    id="open-modal"
                  >
                    <IonLabel className="ml-5">
                      <p>NÚMERO DE CLIENTES NO MÊS</p>
                      <h2>{numberOfClients}</h2>
                    </IonLabel>
                  </IonItem>
                </div>
              </div>
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

export default NumberClientsMonth;
