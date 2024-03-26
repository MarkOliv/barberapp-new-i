import * as React from "react";

import { useForm } from "react-hook-form";

import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  IonContent,
  IonIcon,
  IonInput,
  IonLabel,
  IonPage,
  IonSelect,
  IonSelectOption,
  useIonLoading,
  useIonToast,
} from "@ionic/react";
import { Link } from "react-router-dom";
import { close, eye, eyeOff } from "ionicons/icons";

import * as Yup from "yup";
import supabase from "../../../utils/supabase";

type specialtiesType = {
  name: string;
};

const BarberRegister = () => {
  const [specialties, setSpecialties] = React.useState<Array<specialtiesType>>(
    []
  );

  const [showLoading, hideLoading] = useIonLoading();
  const [showToast] = useIonToast();

  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    React.useState<boolean>(false);

  // const router = useIonRouter();

  const schema = Yup.object().shape({
    fullName: Yup.string().required("Nome é obrigatório"),
    specialties: Yup.array().required("A categoria é obrigatória"),
    email: Yup.string()
      .email("Insira um e-mail válido")
      .required("E-mail é obrigatório"),
    password: Yup.string()
      .min(6, "A senha deve ter no mínimo 6 caracteres")
      .required("A senha é obrigatória"),
    confirmPassword: Yup.string()
      .required("Repetir a senha é obrigatório")
      .oneOf([Yup.ref("password")], "As senhas não conferem"),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const getSpecialties = async () => {
    try {
      let { data: specialties, error } = await supabase
        .from("specialties")
        .select("*");

      if (error) {
        await showToast({
          position: "top",
          message: error.message,
          duration: 3000,
        });
      }

      if (specialties) {
        await setSpecialties(specialties);
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

  const handleRegister = async (data: any) => {
    await showLoading();
    // console.log(data.email);

    try {
      let { user, error } = await supabase.auth.signUp(
        {
          email: data.email,
          password: data.password,
        },
        {
          data: {
            email: data.email,
            full_name: data.fullName,
            specialties: data.specialties,
            barber: true,
            off_work: false,
            lunch_time: [
              "13:00",
              "13:15",
              "13:30",
              "13:45",
              "14:00",
              "14:15",
              "14:30",
              "14:45",
            ],
          },
        }
      );

      if (error) {
        await showToast({
          message: error.message,
          duration: 2000,
        });
        console.log(error);
      }

      if (user) {
        await showToast({
          message:
            "Verifique seu e-email para logar e concluir o cadastro como barbeiro",
          duration: 2000,
        });
        handleCreateNewBarber(
          user.id,
          data.fullName,
          data.specialties,
          data.email
        );
      }
    } catch (e) {
      await showToast({
        message: "Erro interno, por favor tente novamente mais tarde",
        duration: 2000,
      });
    } finally {
      await hideLoading();
    }
  };

  const handleCreateNewBarber = async (
    user_id: any,
    full_name: any,
    specialties: Array<any>,
    email: string
  ) => {
    await showLoading();
    // console.log(user_id, full_name, specialties);

    try {
      const { data, error } = await supabase.from("barbers").insert([
        {
          id: user_id,
          username: full_name,
          specialties: specialties,
          email: email,
        },
      ]);

      if (error) {
        await showToast({
          message: error.message,
          duration: 2000,
        });
        console.log(error);
      }

      if (data) {
        await showToast({
          message: "Verifique seu e-email para logar",
          duration: 2000,
        });
      }
    } catch (e) {
      await showToast({
        message: "Erro interno, por favor tente novamente mais tarde",
        duration: 2000,
      });
    } finally {
      await hideLoading();
    }
  };

  React.useEffect(() => {
    getSpecialties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="flex flex-col justify-center ion-padding h-screen bg-gray-100">
          <div className="absolute top-3 right-3">
            <Link
              to="/app/home"
              className="flex justify-center items-center rounded-full bg-gray-200 w-8 h-8"
            >
              <IonIcon className="w-6 h-6" src={close} />
            </Link>
          </div>
          <form onSubmit={handleSubmit(handleRegister)}>
            <IonLabel className="text-gray-600" position="stacked">
              Nome completo
            </IonLabel>
            <div className="flex items-center bg-gray-200 rounded-xl p-3 my-3">
              <IonInput
                type="text"
                autocomplete={"name"}
                placeholder="José da Silva"
                {...register("fullName")}
              />
            </div>
            <ErrorMessage
              errors={errors}
              name="fullName"
              as={<div style={{ color: "red" }} />}
            />

            <IonLabel className="text-gray-600" position="stacked">
              Especialidade
            </IonLabel>
            <IonSelect
              multiple={true}
              className="bg-gray-200 rounded-xl placeholder: text-gray-700 my-3"
              placeholder="Selecione suas especialidades..."
              {...register("specialties")}
            >
              {specialties.map((specialtie, index) => (
                <IonSelectOption key={index} value={specialties[index].name}>
                  {specialties[index].name}
                </IonSelectOption>
              ))}
            </IonSelect>
            <ErrorMessage
              errors={errors}
              name="address"
              as={<div style={{ color: "red" }} />}
            />

            <IonLabel className="text-gray-600" position="stacked">
              E-mail
            </IonLabel>
            <div className="flex items-center bg-gray-200 rounded-xl p-3 my-3">
              <IonInput
                autocomplete={"email"}
                type="email"
                placeholder="email@email.com"
                {...register("email")}
              />
            </div>
            <ErrorMessage
              errors={errors}
              name="email"
              as={<div style={{ color: "red" }} />}
            />

            <IonLabel className="text-gray-600" position="stacked">
              Senha
            </IonLabel>
            <div className="flex items-center bg-gray-200 rounded-xl p-3 my-3">
              <IonInput
                autocomplete={"new-password"}
                type={showPassword ? "text" : "password"}
                placeholder="********"
                {...register("password")}
              />
              <IonIcon
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
                className="ml-2 text-green-700 w-6 h-6"
                src={showPassword ? eyeOff : eye}
              />
            </div>
            <ErrorMessage
              errors={errors}
              name="password"
              as={<div style={{ color: "red" }} />}
            />

            <IonLabel className="text-gray-600" position="stacked">
              Repita sua senha
            </IonLabel>
            <div className="flex items-center bg-gray-200 rounded-xl p-3 my-3">
              <IonInput
                type={showConfirmPassword ? "text" : "password"}
                placeholder="********"
                {...register("confirmPassword")}
              />
              <IonIcon
                onClick={() => {
                  setShowConfirmPassword(!showConfirmPassword);
                }}
                className="ml-2 text-green-700 w-6 h-6"
                src={showConfirmPassword ? eyeOff : eye}
              />
            </div>
            <ErrorMessage
              errors={errors}
              name="confirmPassword"
              as={<div style={{ color: "red" }} />}
            />

            <button
              type="submit"
              className="p-4 w-full rounded-xl text-white my-3 bg-gradient-to-l from-green-800 to-green-700"
            >
              Cadastrar
            </button>
          </form>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default BarberRegister;
