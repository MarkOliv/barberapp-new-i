// @flow
import {
  IonContent,
  IonIcon,
  IonInput,
  IonLabel,
  IonTextarea,
  IonTitle,
  useIonLoading,
  useIonToast,
} from "@ionic/react";
import { call, clipboard, home, mail, person } from "ionicons/icons";

import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import "yup-phone";
import { useForm } from "react-hook-form";
import React from "react";
import supabase from "../utils/supabase";
import { useAuth } from "../contexts";

type Props = {
  type: string;
  data: any;
};
export const ModalEditInfo = (props: Props) => {
  const { type, data } = props;

  const [showToast] = useIonToast();
  const [showLoading, hideLoading] = useIonLoading();

  const [userType, setUserType] = React.useState<string>();
  const { sessionUser } = useAuth();

  const schemaEmail = Yup.object().shape({
    email: Yup.string()
      .required("E-mail é obrigatório")
      ?.email("Insira um e-mail válido"),
  });

  const schemaPhone = Yup.object().shape({
    phone: Yup.string()?.phone(
      "BR",
      false,
      "insira um numero de telefone válido"
    ),
  });

  const schemaUsername = Yup.object().shape({
    username: Yup.string().required("Insira seu novo nome"),
  });

  const schemaAddress = Yup.object().shape({
    address: Yup.string().required("Insira seu novo endereço"),
  });

  const schemaBio = Yup.object().shape({
    bio: Yup.string()
      .required("Insira sua nova bio")
      .max(70, "máximo de caracteres 70"),
  });

  const {
    handleSubmit: SubmitEmail,
    register: registerEmail,
    formState: { errors: errorsEmail },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schemaEmail),
  });

  const {
    handleSubmit: SubmitPhone,
    register: registerPhone,
    formState: { errors: errorsPhone },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schemaPhone),
  });

  const {
    handleSubmit: SubmitUserName,
    register: registerUserName,
    formState: { errors: errorsUserName },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schemaUsername),
  });

  const {
    handleSubmit: SubmitAddress,
    register: registerAddress,
    formState: { errors: errorsAddress },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schemaAddress),
  });

  const {
    handleSubmit: SubmitBio,
    register: registerBio,
    formState: { errors: errorsBio },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schemaBio),
  });

  const handleSubmitEmail = async (data: any) => {
    await showLoading();
    try {
      var newEmail = data.email;

      const { data: email, error: emailError } = await supabase.auth.update({
        email: newEmail,
      });

      if (email) {
        await showToast({
          message: "Email alterado com sucesso",
          duration: 3000,
        }).then(() => {
          updateEmailInDB(newEmail);
        });
      }

      if (emailError) {
        await showToast({
          message: `Erro ao atualizar email, erro de código: ${emailError.status}`,
          duration: 3000,
        });
      }
    } catch (error) {
      await showToast({
        message: `Erro!!! ${error}`,
        duration: 2000,
      });
    }
  };

  const updateEmailInDB = async (email: string) => {
    try {
      if (userType === "barber") {
        const { data, error } = await supabase
          .from("barbers")
          .update({ email: email })
          .eq("id", sessionUser?.id);

        if (data) {
          await showToast({
            message: "Email alterado com sucesso",
            duration: 3000,
          }).then(() => {
            document.location.reload();
          });
        }

        if (error) {
          await showToast({
            message: `Erro ao atualizar email, erro de código: ${error.code}`,
            duration: 3000,
          }).then(() => {
            document.location.reload();
          });
        }
      } else {
        const { data, error } = await supabase
          .from("clients")
          .update({ email: email })
          .eq("id", sessionUser?.id);

        if (data) {
          await showToast({
            message: "Email alterado com sucesso",
            duration: 3000,
          }).then(() => {
            document.location.reload();
          });
        }

        if (error) {
          await showToast({
            message: `Erro ao atualizar email, erro de código: ${error.code}`,
            duration: 3000,
          }).then(() => {
            document.location.reload();
          });
        }
      }
    } catch (error) {
      await showToast({
        message: `Erro!!! ${error}`,
        duration: 2000,
      });
    } finally {
      await hideLoading();
    }
  };

  const handleSubmitUserName = async (data: any) => {
    await showLoading();
    try {
      const { data: fullName, error: fullNameError } =
        await supabase.auth.update({
          data: { username: data?.username },
        });

      if (fullName) {
        await showToast({
          message: "Nome alterado com sucesso",
          duration: 3000,
        }).then(() => {
          updateUserNameInDB(data?.username);
        });
      }

      if (fullNameError) {
        await showToast({
          message: `Erro ao atualizar nome, erro de código: ${fullNameError.status}`,
          duration: 3000,
        });
      }
    } catch (error) {
      await showToast({
        message: `Erro!!! ${error}`,
        duration: 2000,
      });
    }
  };

  const updateUserNameInDB = async (name: string) => {
    await showLoading();
    try {
      if (userType === "barber") {
        const { data, error } = await supabase
          .from("barbers")
          .update({ full_name: name })
          .eq("id", sessionUser?.id);

        if (data) {
          await showToast({
            message: "Email alterado com sucesso",
            duration: 3000,
          }).then(() => {
            document.location.reload();
          });
        }

        if (error) {
          await showToast({
            message: `Erro ao atualizar email, erro de código: ${error.code}`,
            duration: 3000,
          });
        }
      } else {
        const { data, error } = await supabase
          .from("clients")
          .update({ full_name: name })
          .eq("id", sessionUser?.id);

        if (data) {
          await showToast({
            message: "Email alterado com sucesso",
            duration: 3000,
          }).then(() => {
            document.location.reload();
          });
        }

        if (error) {
          await showToast({
            message: `Erro ao atualizar email, erro de código: ${error.code}`,
            duration: 3000,
          }).then(() => {
            document.location.reload();
          });
        }
      }
    } catch (error) {
      await showToast({
        message: `Erro!!! ${error}`,
        duration: 2000,
      });
    } finally {
      await hideLoading();
    }
  };

  const handleSubmitPhone = async (data: any) => {
    await showLoading();
    try {
      const { data: phone, error: phoneError } = await supabase.auth.update({
        data: { phone: data?.phone },
      });

      if (phone) {
        await showToast({
          message: "Telefone alterado com sucesso",
          duration: 3000,
        }).then(() => {
          updatePhoneInDB(data?.phone);
        });
      }

      if (phoneError) {
        await showToast({
          message: `Erro ao atualizar telefone, erro de código: ${phoneError.status}`,
          duration: 3000,
        });
      }
    } catch (error) {
      await showToast({
        message: `Erro!!! ${error}`,
        duration: 2000,
      });
    }
  };

  const updatePhoneInDB = async (phone: string) => {
    try {
      if (userType === "barber") {
        const { data, error } = await supabase
          .from("barbers")
          .update({ phone: phone })
          .eq("id", sessionUser?.id);

        if (data) {
          await showToast({
            message: "Email alterado com sucesso",
            duration: 3000,
          }).then(() => {
            document.location.reload();
          });
        }

        if (error) {
          await showToast({
            message: `Erro ao atualizar email, erro de código: ${error.code}`,
            duration: 3000,
          }).then(() => {
            document.location.reload();
          });
        }
      } else {
        const { data, error } = await supabase
          .from("clients")
          .update({ phone: phone })
          .eq("id", sessionUser?.id);

        if (data) {
          await showToast({
            message: "Phone alterado com sucesso",
            duration: 3000,
          }).then(() => {
            document.location.reload();
          });
        }

        if (error) {
          await showToast({
            message: `Erro ao atualizar email, erro de código: ${error.code}`,
            duration: 3000,
          }).then(() => {
            document.location.reload();
          });
        }
      }
    } catch (error) {
      await showToast({
        message: `Erro!!! ${error}`,
        duration: 2000,
      });
    } finally {
      await hideLoading();
    }
  };

  const handleSubmitAddress = async (data: any) => {
    await showLoading();
    try {
      const { data: address, error: addressError } = await supabase.auth.update(
        {
          data: { address: data?.address },
        }
      );

      if (address) {
        await showToast({
          message: "Endereço alterado com sucesso",
          duration: 3000,
        }).then(() => {
          updateAddressInDB(data?.address);
          document.location.reload();
        });
      }

      if (addressError) {
        await showToast({
          message: `Erro ao atualizar endereço, erro de código: ${addressError.status}`,
          duration: 3000,
        }).then(() => {
          document.location.reload();
        });
      }
    } catch (error) {
      await showToast({
        message: `Erro!!! ${error}`,
        duration: 2000,
      });
    }
  };

  const updateAddressInDB = async (address: string) => {
    try {
      if (userType === "clients") {
        const { data, error } = await supabase
          .from("clients")
          .update({ address: address })
          .eq("id", sessionUser?.id);

        if (data) {
          await showToast({
            message: "Email alterado com sucesso",
            duration: 3000,
          }).then(() => {
            document.location.reload();
          });
        }

        if (error) {
          await showToast({
            message: `Erro ao atualizar email, erro de código: ${error.code}`,
            duration: 3000,
          }).then(() => {
            document.location.reload();
          });
        }
      }
    } catch (error) {
      await showToast({
        message: `Erro!!! ${error}`,
        duration: 2000,
      });
    } finally {
      await hideLoading();
    }
  };

  const handleSubmitBio = async (data: any) => {
    await showLoading();
    try {
      const { data: bio, error: bioError } = await supabase.auth.update({
        data: { bio: data?.bio },
      });

      if (bio) {
        updateBioInDB(data?.bio);
      }

      if (bioError) {
        await showToast({
          message: `Erro ao atualizar bio, erro de código: ${bioError?.status}`,
          duration: 3000,
        });
      }
    } catch (error) {
      await showToast({
        message: `Erro!!! ${error}`,
        duration: 2000,
      });
    }
  };

  const updateBioInDB = async (bio: string) => {
    try {
      if (userType === "clients") {
        const { data, error } = await supabase
          .from("clients")
          .update({ bio: bio })
          .eq("id", sessionUser?.id);

        if (data) {
          await showToast({
            message: "bio alterada com sucesso",
            duration: 3000,
          }).then(() => {
            document.location.reload();
          });
        }

        if (error) {
          await showToast({
            message: `Erro ao atualizar a bio, erro de código: ${error.code}`,
            duration: 3000,
          }).then(() => {
            document.location.reload();
          });
        }
      } else {
        const { data, error } = await supabase
          .from("barbers")
          .update({ bio: bio })
          .eq("id", sessionUser?.id);

        if (data) {
          await showToast({
            message: "bio alterada com sucesso",
            duration: 3000,
          });
        }

        if (error) {
          await showToast({
            message: `Erro ao atualizar a bio, erro de código: ${error.code}`,
            duration: 3000,
          }).then(() => {
            document.location.reload();
          });
        }
      }
    } catch (error) {
      await showToast({
        message: `Erro!!! ${error}`,
        duration: 2000,
      });
    } finally {
      await hideLoading();
      document.location.reload();
    }
  };

  React.useEffect(() => {
    if (sessionUser?.user_metadata?.barber) {
      setUserType("barber");
    } else {
      setUserType("clients");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <IonContent>
      {type === "username" && (
        <form onSubmit={SubmitUserName(handleSubmitUserName)}>
          <div className="flex justify-around rounded-b-md p-3 bg-gradient-to-l from-green-800 to-green-600">
            <IonTitle className="text-white">Nome</IonTitle>
            <div className="p-2">
              <button type="submit" className="ml-2 text-white">
                SALVAR
              </button>
            </div>
          </div>
          <div className="p-5">
            <IonLabel className="ml-2 text-gray-600">
              Digite seu novo nome
            </IonLabel>
            <div className="flex items-center bg-gray-200 rounded-md">
              <IonIcon className="ml-3" src={person} />
              <IonInput
                type="text"
                placeholder={data}
                {...registerUserName("username")}
              />
            </div>
            <ErrorMessage
              errors={errorsUserName}
              name="username"
              as={<div style={{ color: "red" }} />}
            />
          </div>
        </form>
      )}
      {type === "email" && (
        <form onSubmit={SubmitEmail(handleSubmitEmail)}>
          <div className="flex justify-around rounded-b-md p-3 bg-gradient-to-l from-green-800 to-green-600">
            <IonTitle className="text-white">E-mail</IonTitle>
            <div className="p-2">
              <button type="submit" className="ml-2 text-white">
                SALVAR
              </button>
            </div>
          </div>
          <div className="p-5">
            <IonLabel className="ml-2 text-gray-600">
              Digite seu novo E-mail
            </IonLabel>
            <div className="flex items-center bg-gray-200 rounded-md">
              <IonIcon className="ml-3" src={mail} />
              <IonInput
                type="text"
                placeholder={data}
                {...registerEmail("email")}
              />
            </div>
            <ErrorMessage
              errors={errorsEmail}
              name="email"
              as={<div style={{ color: "red" }} />}
            />
          </div>
        </form>
      )}
      {type === "phone" && (
        <form onSubmit={SubmitPhone(handleSubmitPhone)}>
          <div className="flex justify-around rounded-b-md p-3 bg-gradient-to-l from-green-800 to-green-600">
            <IonTitle className="text-white">Telefone</IonTitle>
            <div className="p-2">
              <button type="submit" className="ml-2 text-white">
                SALVAR
              </button>
            </div>
          </div>
          <div className="p-5">
            <IonLabel className="ml-2 text-gray-600">
              Digite seu novo Telefone
            </IonLabel>
            <div className="flex items-center bg-gray-200 rounded-md">
              <IonIcon className="ml-3" src={call} />
              <IonInput
                type="text"
                placeholder={data ? data : "Digite seu novo número"}
                {...registerPhone("phone")}
              />
            </div>
            <ErrorMessage
              errors={errorsPhone}
              name="phone"
              as={<div style={{ color: "red" }} />}
            />
          </div>
        </form>
      )}
      {type === "address" && (
        <form onSubmit={SubmitAddress(handleSubmitAddress)}>
          <div className="flex justify-around rounded-b-md p-3 bg-gradient-to-l from-green-800 to-green-600">
            <IonTitle className="text-white">Endereço</IonTitle>
            <div className="p-2">
              <button type="submit" className="ml-2 text-white">
                SALVAR
              </button>
            </div>
          </div>
          <div className="p-5">
            <IonLabel className="ml-2 text-gray-600">
              Digite seu novo endereço
            </IonLabel>
            <div className="flex items-center bg-gray-200 rounded-md">
              <IonIcon className="ml-3" src={home} />
              <IonInput
                type="text"
                placeholder={data}
                {...registerAddress("address")}
              />
            </div>
            <ErrorMessage
              errors={errorsAddress}
              name="address"
              as={<div style={{ color: "red" }} />}
            />
          </div>
        </form>
      )}
      {type === "bio" && (
        <form onSubmit={SubmitBio(handleSubmitBio)}>
          <div className="flex justify-around rounded-b-md p-3 bg-gradient-to-l from-green-800 to-green-600">
            <IonTitle className="text-white">Bio</IonTitle>
            <div className="p-2">
              <button type="submit" className="ml-2 text-white">
                SALVAR
              </button>
            </div>
          </div>
          <div className="p-5">
            <IonLabel className="ml-2 text-gray-600">
              Digite sua nova bio
            </IonLabel>
            <div className="flex items-center bg-gray-200 h-32 rounded-md">
              <IonIcon className="ml-3" src={clipboard} />
              <IonTextarea
                className="h-28"
                placeholder={data}
                {...registerBio("bio")}
              />
            </div>
            <ErrorMessage
              errors={errorsBio}
              name="bio"
              as={<div style={{ color: "red" }} />}
            />
          </div>
        </form>
      )}
    </IonContent>
  );
};
