import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import {
  IonContent,
  IonIcon,
  IonInput,
  IonLabel,
  IonModal,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTitle,
  useIonToast,
} from "@ionic/react";

import serviceSvg from "../../assets/razor-barber.png";

import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import supabase from "../../utils/supabase";
import { chevronBackOutline } from "ionicons/icons";
import { useAuth } from "../../contexts";

const Services = () => {
  const [showToast] = useIonToast();

  const { sessionUser } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);

  const [schedules, setSchedules] = React.useState<Array<any>>([]);
  const [Categories, setCategories] = React.useState<Array<any>>([]);

  const schema = Yup.object().shape({
    name: Yup.string()
      .min(3, "nome do serviço deve ter no minimo 3 caracteres")
      .required("O nome é obrigatório"),
    category: Yup.string().required("A categoria é obrigatória"),
    time: Yup.number()
      .min(5, "O tempo de serviço deve ser maior que 5")
      .required("Informe quanto tempo leva o serviço"),
    price: Yup.number().required("Informe quanto custa o serviço"),
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
    try {
      const { data: newServiceData, error } = await supabase
        .from("services")
        .insert([
          {
            name: data?.name,
            category: data?.category,
            time: data?.time,
            price: data?.price,
          },
        ]);

      if (error) {
        await showToast({
          position: "top",
          message: error.message,
          duration: 3000,
        }).then(() => {
          setIsOpen(!isOpen);
        });
      }

      if (newServiceData) {
        await showToast({
          position: "top",
          message: "Serviço cadastrado com sucesso",
          duration: 3000,
        }).then(() => {
          setIsOpen(!isOpen);
          getServices();
        });
      }
    } catch (error) {
      await showToast({
        position: "top",
        message: `${error}`,
        duration: 3000,
      });
    } finally {
    }
  };

  const getServices = async () => {
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
        await setSchedules(services);
      }
    } catch (error) {
      await showToast({
        position: "top",
        message: `${error}`,
        duration: 3000,
      });
    }
  };

  const getCategories = async () => {
    try {
      let { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("for", "SERVICES");

      if (error) {
        await showToast({
          position: "top",
          message: error.message,
          duration: 3000,
        });
      }

      if (data) {
        await setCategories(data);
        // console.log(data);
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
    getServices();
    getCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <IonPage>
      {sessionUser && (
        <>
          <IonContent>
            <div className="h-screen bg-gray-100">
              <Link
                to="/app/home"
                className="flex items-center bg-white p-5 border-b h-24"
              >
                <IonIcon className="w-6 h-6" src={chevronBackOutline} />

                <IonTitle className="font-bold">Serviços</IonTitle>
              </Link>
              <div className="py-10 px-5">
                {sessionUser?.user_metadata?.barber && (
                  <div
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex flex-col justify-center items-center h-32 col-span-2 shadow-md rounded-xl bg-gradient-to-l from-green-800 to-green-600"
                  >
                    {/* <IonIcon className="mb-5 w-8 h-8 text-white" src={cut} /> */}
                    <img className="w-10 h-10" src={serviceSvg} alt="" />

                    <IonText className="text-white">
                      Cadastrar novo serviço
                    </IonText>
                  </div>
                )}

                {/* SERVICES */}

                <div className="h-96 overflow-auto rounded-xl my-3">
                  <table className="w-full text-sm text-left text-gray-500 rounded-xl overflow-hidden">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-200">
                      <tr>
                        <th scope="col" className="py-3 px-6">
                          Nome do Serviço
                        </th>
                        <th scope="col" className="py-3 px-6">
                          Categoria
                        </th>
                        <th scope="col" className="py-3 px-6">
                          Preço
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {schedules.map((schedule, index) => (
                        <tr key={index} className="bg-white border-b">
                          <th
                            scope="row"
                            className="py-4 px-6 font-medium text-gray-900"
                          >
                            <div
                              onClick={() => {
                                sessionUser?.user_metadata?.barber
                                  ? document.location.replace(
                                      `/app/edit-service/${schedule?.id}`
                                    )
                                  : console.log("access denied");
                              }}
                            >
                              {schedule?.name}
                            </div>
                          </th>
                          <td className="py-4 px-6 uppercase">
                            {schedule?.category}
                          </td>
                          <td className="py-4 px-6">R${schedule?.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Modal */}
                <IonModal
                  isOpen={isOpen}
                  initialBreakpoint={0.75}
                  breakpoints={[0, 0.25, 0.5, 0.75]}
                >
                  <div className="flex justify-around p-3 bg-gradient-to-l from-green-800 to-green-600">
                    <IonTitle className="text-white">
                      Cadastrar novo serviço
                    </IonTitle>
                    <div className="p-2">
                      <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="ml-2 text-white"
                      >
                        FECHAR
                      </button>
                    </div>
                  </div>

                  <form
                    onSubmit={handleSubmit(handleNewService)}
                    className="ion-padding"
                  >
                    <IonLabel className="text-gray-600" position="stacked">
                      Nome
                    </IonLabel>
                    <div className="flex items-center bg-gray-200 rounded-xl p-3 mt-3">
                      <IonInput
                        type="text"
                        className="placeholder: text-gray-600"
                        placeholder="Corte de cabelo simples"
                        {...register("name")}
                      />
                    </div>
                    <ErrorMessage
                      errors={errors}
                      name="name"
                      as={<div style={{ color: "red" }} />}
                    />
                    <div className="py-5">
                      <IonLabel className="text-gray-600" position="stacked">
                        Categoria
                      </IonLabel>

                      <IonSelect
                        className="bg-gray-200 rounded-xl placeholder: text-gray-700 mt-3"
                        placeholder="Selecione a categoria"
                        {...register("category")}
                      >
                        {Categories.map((category, index) => (
                          <IonSelectOption key={index} value={category?.name}>
                            {category?.name}
                          </IonSelectOption>
                        ))}
                      </IonSelect>
                      <ErrorMessage
                        errors={errors}
                        name="category"
                        as={<div style={{ color: "red" }} />}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <IonLabel className="text-gray-600" position="stacked">
                          Tempo em minutos
                        </IonLabel>

                        <div className="flex items-center bg-gray-200 rounded-xl p-3 mt-3">
                          <IonInput
                            type={"number"}
                            className="placeholder: text-gray-600"
                            placeholder="20 minutos"
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
                        <IonLabel className="text-gray-600" position="stacked">
                          Preço
                        </IonLabel>

                        <div className="flex items-center bg-gray-200 rounded-xl p-3 mt-3">
                          <IonLabel className="text-gray-400">R$</IonLabel>
                          <IonInput
                            step="0.01"
                            type={"number"}
                            className="placeholder: text-gray-600"
                            placeholder="15,50"
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
                      className="p-4 w-full rounded-xl bg-gradient-to-l from-green-800 to-green-700 text-white my-5"
                    >
                      SALVAR
                    </button>
                  </form>
                </IonModal>
              </div>
            </div>
          </IonContent>
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
    </IonPage>
  );
};

export default Services;
