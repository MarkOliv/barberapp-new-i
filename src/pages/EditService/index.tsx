// @flow
import * as React from "react";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import {
  IonContent,
  IonIcon,
  IonInput,
  IonLabel,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTitle,
  useIonToast,
} from "@ionic/react";

import { useForm } from "react-hook-form";

import supabase from "../../utils/supabase";
import { useParams } from "react-router";
import { chevronBackOutline } from "ionicons/icons";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts";

export const EditService = () => {
  const [showToast] = useIonToast();

  const id: any = useParams();
  const { sessionUser } = useAuth();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [serviceId, setServiceId] = React.useState(id?.ServiceId);
  const [currentService, setCurrentService] = React.useState<any>();

  const schema = Yup.object().shape({
    name: Yup.string(),
    category: Yup.string(),
    time: Yup.string(),
    price: Yup.string(),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const handleNewService = async (data: any) => {
    // console.log(data?.price.length);

    let category = `${data?.category}`;
    let name = `${data?.name}`;
    let time = `${data?.time}`;
    let price = `${data?.price}`;
    try {
      const { data: newServiceData, error } = await supabase
        .from("services")
        .update([
          {
            name: name.length === 0 ? currentService?.name : data?.name,
            category:
              category.length === 0 ? currentService?.category : category,
            time: Number(time.length === 0 ? currentService?.time : data?.time),
            price: Number(
              price.length === 0 ? currentService?.price : data?.price
            ),
          },
        ])
        .eq("id", serviceId);

      if (error) {
        await showToast({
          position: "top",
          message: error.message,
          duration: 3000,
        });
      }

      if (newServiceData) {
        await showToast({
          position: "top",
          message: "Serviço atualizado com sucesso",
          duration: 3000,
        }).then(() => {
          document.location.replace("/app/services/");
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

  const getService = async () => {
    try {
      let { data: service, error } = await supabase
        .from("services")
        .select("*")
        .eq("id", serviceId);

      if (service) {
        setCurrentService(service[0]);
      }

      if (error) {
        await showToast({
          position: "top",
          message: error.message,
          duration: 3000,
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
    getService();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <IonPage>
      <IonContent>
        {sessionUser && (
          <>
            <Link
              to="/app/services"
              className="flex items-center bg-white p-5 border-b h-24"
            >
              <IonIcon className="w-6 h-6" src={chevronBackOutline} />

              <IonTitle className="font-bold">Editar Serviço</IonTitle>
            </Link>
            <form
              onSubmit={handleSubmit(handleNewService)}
              className="ion-padding"
            >
              <IonLabel className="text-gray-900" position="stacked">
                Nome
              </IonLabel>
              <div className="flex items-center bg-gray-200 rounded-xl p-3 mt-3">
                <IonInput
                  type="text"
                  className="placeholder: text-gray-900"
                  placeholder={`${currentService?.name}`}
                  {...register("name")}
                />
              </div>
              <ErrorMessage
                errors={errors}
                name="name"
                as={<div style={{ color: "red" }} />}
              />
              <div className="py-5">
                <IonLabel className="text-gray-900" position="stacked">
                  Categoria
                </IonLabel>

                <IonSelect
                  className="bg-gray-200 rounded-xl placeholder: text-black mt-3"
                  placeholder={currentService?.category}
                  {...register("category")}
                >
                  <IonSelectOption value="cabelo">Cabelo</IonSelectOption>
                  <IonSelectOption value="barba">Barba</IonSelectOption>
                </IonSelect>
                <ErrorMessage
                  errors={errors}
                  name="category"
                  as={<div style={{ color: "red" }} />}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <IonLabel className="text-gray-900" position="stacked">
                    Tempo em minutos
                  </IonLabel>

                  <div className="flex items-center bg-gray-200 rounded-xl p-3 mt-3">
                    <IonInput
                      type={"number"}
                      className="placeholder: text-gray-900"
                      placeholder={`${currentService?.time} minutos`}
                      {...register("time")}
                    />
                  </div>
                  <ErrorMessage
                    errors={errors}
                    name="time"
                    as={<div style={{ color: "red" }} />}
                  />
                </div>
                <div>
                  <IonLabel className="text-gray-900" position="stacked">
                    Preço
                  </IonLabel>

                  <div className="flex items-center bg-gray-200 rounded-xl p-3 mt-3">
                    <IonLabel className="text-gray-400">R$</IonLabel>
                    <IonInput
                      type={"text"}
                      className="placeholder: text-gray-900"
                      placeholder={`${currentService?.price}`}
                      {...register("price")}
                    />
                  </div>
                  <ErrorMessage
                    errors={errors}
                    name="price"
                    as={<div style={{ color: "red" }} />}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="p-4 w-full rounded-xl text-white my-5 bg-gradient-to-l from-green-800 to-green-700"
              >
                SALVAR
              </button>
              <div
                onClick={async () => {
                  const { data, error } = await supabase
                    .from("services")
                    .delete()
                    .eq("id", currentService?.id);

                  if (data) {
                    await showToast({
                      position: "top",
                      message: "Deletado com sucesso",
                      duration: 2000,
                    });
                    document.location.replace("/app/services");
                  }
                }}
                className="flex justify-center items-center cursor-pointer p-4 w-full rounded-xl text-white my-3 bg-gradient-to-l from-red-800 to-red-700"
              >
                DELETAR
              </div>
            </form>
          </>
        )}
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
