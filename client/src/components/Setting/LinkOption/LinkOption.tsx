import style from '../settingGeneric.module.css';
import input_style from '../../Recycle/input.module.css';

import Input from '../../Recycle/Input';

import GithubIcon from '../../../assets/icons/github.svg';
import EmailIcon from '../../../assets/icons/email.svg';
import { SocialDTO } from '../../UserPage/UserPage';
import { useEffect, useState } from 'react';
import { SpinnerButton } from '../../Recycle/Button';
import { useNotify } from '../../Notify/NotifyContext';
import { validateEmail, validateStringId } from '../../Utils/misc';
import request from '../../Utils/request';

type Props = {
    defaultValue: SocialDTO,
    onChangeSocial?: (data: SocialDTO) => void
}
export default function SettingLinkOption({ defaultValue, onChangeSocial }: Props) {
    const [ loading, setLoading ] = useState(false);
    const [ github, setGithub ] = useState("");
    const [ email, setEmail ] = useState("");
    const notify = useNotify();

    const onApply = async function() {
        const form: SocialDTO = {
            email: null,
            github: null
        };

        if ((github === "" ? null : github) !== defaultValue.github)
            form.github = github;
        if ((email === "" ? null : email) !== defaultValue.email)
            form.email = email;
        
        // 변경 사항이 없는지 확인
        if (form.email === null && form.github === null) {
            notify("Error", "변경사항이 없습니다.", 5000);
            return;
        }

        // 입력 검사
        if (form.email !== null && email !== "" && !validateEmail(email)) {
            notify("Error", "이메일 형식이 아닙니다.", 5000);
            return;
        }
        if (form.github !== null && github !== "" && !validateStringId(github)) {
            notify("Error", "깃허브 아이디 형식이 아닙니다.", 5000);
            return;
        }

        setLoading(true);

        request("profile/social", { method: "POST", data: form })
        .then(() => {
            // 새로운 변경사항으로 머지 (merge)
            const newData = { ...defaultValue };
            if (form.github !== null)
                newData.github = form.github === "" ? null : form.github;
            if (form.email !== null)
                newData.email = form.email === "" ? null : form.email;

            if (onChangeSocial)
                onChangeSocial(newData);

            notify("Success", "저장되었습니다.", 5000);
        })
        .catch(() => notify("Error", "저장할 수 없습니다. 나중에 다시 시도하세요.", 5000))
        .finally(() => setLoading(false));
    }

    useEffect(() => {
        setGithub(defaultValue.github || "");
        setEmail(defaultValue.email || "");
    }, [ defaultValue ]);

    return <section className={style.link_screen}>
        <h3>연동</h3>

        <LinkInput icon={GithubIcon} placeholder="Github 아이디를 입력하세요. ex) qazplm5602" value={github} setValue={setGithub} />
        <LinkInput icon={EmailIcon} placeholder="Email을 입력하세요." value={email} setValue={setEmail} />

        <SpinnerButton className={[style.save_btn]} loading={loading} onClick={onApply}>저장</SpinnerButton>
    </section>;
}

function LinkInput({ icon, placeholder, value, setValue }: { icon: string, placeholder?: string, value: string, setValue: React.Dispatch<React.SetStateAction<string>> }) {
    const onValueChange = function(e: React.ChangeEvent<HTMLInputElement>) {
        setValue(e.target.value);
    }
    
    return <div className={style.field}>
        <img src={icon} />
        <Input type='text' placeholder={placeholder} className={input_style.input} value={value} onChange={onValueChange} />
    </div>;
}