// @flow
import * as React from "react";

import {
  IonContent,
  IonIcon,
  IonInput,
  IonLabel,
  IonList,
  IonPage,
  IonText,
  IonTitle,
  useIonToast,
} from "@ionic/react";

import { Link } from "react-router-dom";
import { useAuth } from "../../../../contexts";
import { chevronBackOutline, trashBin } from "ionicons/icons";
import supabase from "../../../../utils/supabase";

const RegisterSpecialties = () => {
  const { sessionUser } = useAuth();
  const [showToast] = useIonToast();

  const [specialties, setSpecialties] = React.useState<Array<any>>([]);
  const [newSpecialtie, setNewSpecialtie] = React.useState<any>();

  const handleNewSpecialtie = async () => {
    try {
      const { data, error } = await supabase
        .from("specialties")
        .insert([{ name: newSpecialtie }]);

      if (error) {
        await showToast({
          position: "top",
          message: error.message,
          duration: 3000,
        });
      }

      if (data) {
        setSpecialties((current) => [...current, data[0]]);
      }
    } catch (error) {
      await showToast({
        position: "top",
        message: `${error}`,
        duration: 3000,
      });
    }
  };

  const getSpecialties = async () => {
    try {
      let { data, error } = await supabase.from("specialties").select("*");

      if (error) {
        await showToast({
          position: "top",
          message: error.message,
          duration: 3000,
        });
      }

      if (data) {
        await setSpecialties(data);
        console.log(data);
      }
    } catch (error) {
      await showToast({
        position: "top",
        message: `${error}`,
        duration: 3000,
      });
    }
  };

  const HandleRemoveSpecialtie = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("specialties")
        .delete()
        .eq("id", id);

      if (error) {
        await showToast({
          position: "top",
          message: error.message,
          duration: 3000,
        });
      }

      if (data) {
        await showToast({
          position: "top",
          message: "Especialidade excluida com sucesso !",
          duration: 3000,
        });
        console.log(data);

        getSpecialties();
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
    getSpecialties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    console.log(specialties);
  }, [specialties]);

  return (
    <IonPage>
      <IonContent>
        {sessionUser && (
          <>
            <div className="h-screen bg-gray-100">
              <Link
                to="/app/config/specialties"
                className="flex items-center bg-white p-5 border-b h-24"
              >
                <IonIcon className="w-6 h-6" src={chevronBackOutline} />

                <IonTitle className="font-bold">Especialidades</IonTitle>
              </Link>
              <div className="py-10 px-5">
                <div className="w-full h-auto shadow rounded-3xl py-3 bg-white">
                  <div className="flex justify-start mx-5">
                    <IonText className="ml-2 text-gray-500">
                      Especialidades Cadastradas
                    </IonText>
                  </div>
                  <div className="flex justify-center">
                    <div className="h-[1px] w-4/5 bg-gray-500" />
                  </div>
                  <IonList className="w-full h-full p-5 rounded-3xl bg-transparent">
                    {specialties.map((specialtie, index) => (
                      <div key={index} className="grid grid-cols-3 w-full py-2">
                        <IonLabel className="text-gray-500 col-span-2">
                          {specialtie?.name}
                        </IonLabel>
                        <div className="flex justify-end items-center">
                          <IonIcon
                            onClick={() => {
                              HandleRemoveSpecialtie(specialtie?.id);
                            }}
                            className="text-red-500 w-4 h-4"
                            src={trashBin}
                          />
                        </div>
                      </div>
                    ))}
                  </IonList>
                </div>
              </div>

              <div className="ion-padding">
                <IonLabel className="text-gray-400">
                  Nova Especialidade
                </IonLabel>
                <div className="flex items-center bg-gray-200 rounded-xl p-3">
                  <IonInput
                    type="text"
                    className="placeholder: text-gray-900"
                    placeholder={`Nova especialidade`}
                    onIonChange={({ detail }) => {
                      setNewSpecialtie(detail?.value);
                    }}
                  />
                </div>
                <button
                  onClick={handleNewSpecialtie}
                  className="p-4 w-full rounded-xl text-white my-5 bg-gradient-to-l from-green-800 to-green-700"
                >
                  Cadatrar
                </button>
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

export default RegisterSpecialties;
