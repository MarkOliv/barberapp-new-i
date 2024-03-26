import React from "react";
import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonModal,
  IonPage,
  IonSlide,
  IonSlides,
  IonText,
  IonTitle,
  useIonLoading,
  useIonRouter,
  useIonToast,
} from "@ionic/react";
import {
  chevronBackOutline,
  home,
  mail,
  person,
  phonePortrait,
  settingsSharp,
  create,
} from "ionicons/icons";

import { Link, useParams } from "react-router-dom";
import { ModalEditInfo } from "../../components/ModalEditInfo";
import { useAuth } from "../../contexts";
import supabase from "../../utils/supabase";

const Profile = () => {
  const [showToast] = useIonToast();

  const [typeModal, setTypeModal] = React.useState<string>("");
  const [modalData, setModalData] = React.useState<any>();
  const [currentProfilePage, setCurrentProfilePage] = React.useState<any>([]);
  const [profileImage, setProfileImage] = React.useState<string>();
  const [specialties, setSpecialties] = React.useState<Array<any>>([]);

  const [showLoading, hideLoading] = useIonLoading();

  const slideOpts = {
    initialSlide: 1,
    speed: 400,
  };

  //user
  const id: any = useParams();
  const { sessionUser } = useAuth();
  const router = useIonRouter();

  const [isUserCurrentProfilePage, setIsUserCurrentProfilePage] =
    React.useState<boolean>();

  const getBarberProfile = async () => {
    try {
      let { data, error } = await supabase
        .from("barbers")
        .select("*")

        .eq("id", id.id);

      if (error) {
        await showToast({
          position: "top",
          message: error.message,
          duration: 3000,
        });
        console.log(error);
      }

      if (data) {
        if (data.length !== 0) {
          setCurrentProfilePage(data);
        }
      }
    } catch (error) {
      await showToast({
        position: "top",
        message: `${error}`,
        duration: 3000,
      });
    }
  };

  const getClientProfile = async () => {
    try {
      let { data, error } = await supabase
        .from("clients")
        .select("*")

        .eq("id", id.id);

      if (error) {
        await showToast({
          position: "top",
          message: error.message,
          duration: 3000,
        });
        console.log(error);
      }

      if (data) {
        if (data.length !== 0) {
          setCurrentProfilePage(data);
        }
      }
    } catch (error) {}
  };

  const getProfile = async () => {
    try {
      if (id.id === sessionUser?.id) {
        if (sessionUser?.user_metadata?.barber) {
          getBarberProfile();
        } else {
          getClientProfile();
        }
      } else {
        getClientProfile();
        getBarberProfile();
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

  const getAvatarUrl = async (avatar_url: string) => {
    const { publicURL, error } = supabase.storage
      .from("avatar-images")
      .getPublicUrl(`public/${avatar_url}`);

    if (error) {
      await showToast({
        position: "top",
        message: `${error}`,
        duration: 3000,
      });
      console.log(error);
    }
    if (publicURL) {
      console.log(publicURL);
      setProfileImage(publicURL);
    }
  };

  const editBio = () => {
    setTypeModal("bio");
    setModalData(currentProfilePage[0]?.bio);
  };

  const editEmail = () => {
    setTypeModal("email");
    setModalData(currentProfilePage[0]?.email);
  };

  const editUsername = () => {
    setTypeModal("username");
    setModalData(currentProfilePage[0]?.username);
  };

  const editPhone = () => {
    setTypeModal("phone");
    setModalData(currentProfilePage?.phone);
  };
  const editAddress = () => {
    setTypeModal("address");
    setModalData(currentProfilePage[0]?.address);
  };

  React.useEffect(() => {
    getProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    getAvatarUrl(currentProfilePage[0]?.avatar_url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProfilePage]);

  React.useEffect(() => {
    if (id.id === sessionUser?.id) {
      setIsUserCurrentProfilePage(true);
    } else {
      setIsUserCurrentProfilePage(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProfilePage]);

  React.useEffect(() => {
    if (currentProfilePage[0]?.specialties !== undefined) {
      setSpecialties(currentProfilePage[0]?.specialties);
    }
  }, [currentProfilePage]);

  return (
    <IonPage>
      {sessionUser && (
        <IonContent fullscreen>
          <div className="bg-gray-100 h-screen">
            <div className="flex flex-wrap justify-center rounded-b-3xl shadow p-5 bg-gradient-to-l from-green-800 to-green-600">
              <div className="flex items-center w-full mb-5">
                <Link to={"/app/home"}>
                  <IonIcon
                    className="w-6 h-6 text-white"
                    src={chevronBackOutline}
                  />
                </Link>
                <IonTitle className="font-semibold text-center text-white">
                  Perfil
                </IonTitle>
                {id.id === sessionUser?.id && (
                  <IonIcon
                    onClick={async () => {
                      router.push("/app/config");
                    }}
                    className="w-6 h-6 text-white text-right"
                    src={settingsSharp}
                  />
                )}
              </div>
              <div className="flex justify-center shadow-md shadow-green-500/50 rounded-full">
                <img
                  className="w-40 h-40 rounded-full"
                  src={
                    profileImage
                      ? profileImage
                      : "https://spng.pinpng.com/pngs/s/302-3025490_empty-profile-picture-profile-anonymous-hd-png-download.png"
                  }
                  alt="profile"
                />
              </div>

              <div className="w-full">
                <IonTitle className="text-center text-white font-semibold mt-5">
                  {currentProfilePage[0]?.username}
                </IonTitle>
                <p className="text-center text-white">
                  {currentProfilePage[0]?.bio
                    ? currentProfilePage[0]?.bio
                    : "Sem bio ainda"}
                </p>

                <IonIcon
                  id="open-modal5"
                  className={`absolute w-6 h-6 right-10 top-64 text-white ${
                    currentProfilePage[0]?.id === sessionUser?.id
                      ? "block"
                      : "hidden"
                  }`}
                  src={create}
                  key={"bio"}
                  onClick={editBio}
                />
              </div>
            </div>
            {/* content */}
            <div className="p-5">
              <div className="flex justify-start">
                <IonLabel className="text-gray-700 text-xl">
                  Especialidades
                </IonLabel>
              </div>

              <IonSlides pager={true} options={slideOpts}>
                {specialties.map((specialtie, index) => (
                  <IonSlide key={index}>
                    <div className="flex h-28  w-80 justify-center items-center p-3 rounded-3xl bg-white shadow-md my-3">
                      <IonText className="text-gray-600">{specialtie}</IonText>
                    </div>
                  </IonSlide>
                ))}
              </IonSlides>

              <IonItem
                className="mt-2 mb-2 rounded-3xl"
                lines="none"
                id="open-modal"
                key={"Nome"}
                onClick={editUsername}
              >
                <IonIcon src={person} />
                <IonLabel className="ml-5">
                  <h2>Nome</h2>
                  <p>{currentProfilePage[0]?.username}</p>
                </IonLabel>
                {sessionUser?.id === currentProfilePage[0]?.id && (
                  <IonIcon src={create} />
                )}
              </IonItem>

              <IonItem
                className="mt-2 mb-2 rounded-3xl"
                lines="none"
                id="open-modal2"
                key={"email"}
                onClick={editEmail}
              >
                <IonIcon src={mail} />
                <IonLabel className="ml-5">
                  <h2>Email</h2>
                  <p>{currentProfilePage[0]?.email}</p>
                </IonLabel>
                {sessionUser?.id === currentProfilePage[0]?.id && (
                  <IonIcon src={create} />
                )}
              </IonItem>

              <IonItem
                className="mt-2 mb-2 rounded-3xl"
                lines="none"
                id="open-modal3"
                key={"Phone"}
                onClick={editPhone}
              >
                <IonIcon src={phonePortrait} />
                <IonLabel className="ml-5">
                  <h2>Telefone</h2>
                  <p>
                    {currentProfilePage[0]?.phone
                      ? currentProfilePage[0]?.phone
                      : "cadastrar novo telefone"}
                  </p>
                </IonLabel>
                {sessionUser?.id === currentProfilePage[0]?.id && (
                  <IonIcon src={create} />
                )}
              </IonItem>
              <IonItem
                className="mt-2 mb-2 rounded-3xl"
                lines="none"
                id="open-modal4"
                key={"Address"}
                onClick={() => {
                  if (currentProfilePage[0]?.address) {
                    editAddress();
                  } else {
                    showToast({
                      message: `Barbeiros não podem alterar o endereço`,
                      duration: 2000,
                    });
                  }
                }}
              >
                <IonIcon src={home} />
                <IonLabel className="ml-5">
                  <h2>Endereço</h2>
                  <p>{currentProfilePage[0]?.address}</p>
                </IonLabel>
                {sessionUser?.id === currentProfilePage[0]?.id && (
                  <IonIcon src={create} />
                )}
              </IonItem>
            </div>
            {isUserCurrentProfilePage && (
              <>
                <IonModal
                  trigger="open-modal"
                  initialBreakpoint={0.25}
                  breakpoints={[0, 0.25, 0.5, 0.75]}
                >
                  <ModalEditInfo type={typeModal} data={modalData} />
                </IonModal>
                <IonModal
                  trigger="open-modal2"
                  initialBreakpoint={0.25}
                  breakpoints={[0, 0.25, 0.5, 0.75]}
                >
                  <ModalEditInfo type={typeModal} data={modalData} />
                </IonModal>
                <IonModal
                  trigger="open-modal3"
                  initialBreakpoint={0.25}
                  breakpoints={[0, 0.25, 0.5, 0.75]}
                >
                  <ModalEditInfo type={typeModal} data={modalData} />
                </IonModal>
                <IonModal
                  trigger="open-modal4"
                  initialBreakpoint={0.25}
                  breakpoints={[0, 0.25, 0.5, 0.75]}
                >
                  <ModalEditInfo type={typeModal} data={modalData} />
                </IonModal>
                <IonModal
                  trigger="open-modal5"
                  initialBreakpoint={0.5}
                  breakpoints={[0, 0.25, 0.5, 0.75]}
                >
                  <ModalEditInfo type={typeModal} data={modalData} />
                </IonModal>
              </>
            )}
          </div>
        </IonContent>
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
    </IonPage>
  );
};

export default Profile;
