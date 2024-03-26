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
import { useAuth } from "../../../../contexts";
import { chevronBackOutline, trashBin } from "ionicons/icons";
import supabase from "../../../../utils/supabase";

import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useForm } from "react-hook-form";

const EditMyEspecialties = () => {
  const { sessionUser } = useAuth();
  const [showToast] = useIonToast();

  const [specialtiesCurrentUser, setSpecialtiesCurrentUser] = React.useState<
    Array<any>
  >([]);
  const [AllSpecialties, setAllSpecialties] = React.useState<Array<any>>([]);

  const schema = Yup.object().shape({
    specialties: Yup.array().required("A especialidade é obrigatória"),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const handleNewSpecialtie = async (data: any) => {
    for (let i = 0; i < data?.specialties.length; i++) {
      specialtiesCurrentUser.push(data?.specialties[i]);
    }
    // console.log(specialtiesCurrentUser);

    try {
      const { data: newSpecialties, error } = await supabase
        .from("barbers")
        .update([{ specialties: specialtiesCurrentUser }])
        .eq("id", sessionUser?.id);

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
          message: `Especialidades atualizadas`,
          duration: 3000,
        });
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

  const getSpecialtiesCurrentUser = async () => {
    try {
      let { data, error } = await supabase
        .from("barbers")
        .select("*")
        .eq("id", sessionUser?.id);

      if (error) {
        await showToast({
          position: "top",
          message: error.message,
          duration: 3000,
        });
      }

      if (data) {
        let specialties: any = data;
        await setSpecialtiesCurrentUser(specialties[0].specialties);
      }
    } catch (error) {
      await showToast({
        position: "top",
        message: `${error}`,
        duration: 3000,
      });
    }
  };

  const getAllSpecialties = async () => {
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
        await setAllSpecialties(data);
      }
    } catch (error) {
      await showToast({
        position: "top",
        message: `${error}`,
        duration: 3000,
      });
    }
  };

  const HandleRemoveSpecialtie = async (name: string) => {
    // const find = (element: any) => {
    //   return element === name;
    // };
    let i = specialtiesCurrentUser.findIndex((element) => {
      return element === name;
    });

    specialtiesCurrentUser.splice(i, 1);
    console.log(specialtiesCurrentUser);

    try {
      const { data, error } = await supabase
        .from("barbers")
        .update([{ specialties: specialtiesCurrentUser }])
        .eq("id", sessionUser?.id);

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

        getSpecialtiesCurrentUser();
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
    getSpecialtiesCurrentUser();
    getAllSpecialties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                <div className="wW-full h-auto shadow rounded-3xl py-3 bg-white">
                  <div className="flex justify-start mx-5">
                    <IonText className="ml-2 text-gray-500">
                      Especialidades Cadastradas
                    </IonText>
                  </div>
                  <div className="flex justify-center">
                    <div className="h-[1px] w-4/5 bg-gray-500" />
                  </div>
                  <IonList className="w-full h-full p-5 rounded-3xl bg-transparent">
                    {specialtiesCurrentUser.map(
                      (specialtie: any, index: any) => (
                        <div
                          key={index}
                          className="grid grid-cols-3 w-full py-2"
                        >
                          <IonLabel className="text-gray-500 col-span-2">
                            {specialtie}
                          </IonLabel>
                          <div className="flex justify-end items-center">
                            <IonIcon
                              onClick={() => {
                                HandleRemoveSpecialtie(specialtie);
                              }}
                              className="text-red-500 w-4 h-4"
                              src={trashBin}
                            />
                          </div>
                        </div>
                      )
                    )}
                  </IonList>
                </div>
              </div>

              <form
                onSubmit={handleSubmit(handleNewSpecialtie)}
                className="ion-padding"
              >
                <IonLabel className="text-gray-400">
                  Nova Especialidade
                </IonLabel>
                <IonSelect
                  multiple={true}
                  className="bg-gray-200 rounded-xl placeholder: text-gray-700 my-3"
                  placeholder="Selecione suas especialidades..."
                  {...register("specialties")}
                >
                  {AllSpecialties?.map((specialtie: any, index: any) => (
                    <IonSelectOption key={index} value={specialtie?.name}>
                      {specialtie?.name}
                    </IonSelectOption>
                  ))}
                </IonSelect>
                <button
                  type="submit"
                  className="p-4 w-full rounded-xl text-white my-5 bg-gradient-to-l from-green-800 to-green-700"
                >
                  Cadatrar
                </button>
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

export default EditMyEspecialties;
