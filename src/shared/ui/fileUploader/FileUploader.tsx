import { Flex, Text } from "@mantine/core"
import { Dropzone, FileWithPath } from "@mantine/dropzone"
import { notifications } from "@mantine/notifications"
import { FileInfoDto } from "@russian-rs/portal-api-axios"
import { IconFiles, IconUpload, IconX } from "@tabler/icons-react"
import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { ErrorCode, FileRejection } from "react-dropzone-esm"
import { FormattedMessage, useIntl } from "react-intl"
import { FilesApiService } from "src/shared/api/FilesApiService"
import { ErrorNotification } from "src/shared/notifications/ErrorNotification"
import { locales } from "./constants"
import classes from "./FileUploader.module.scss"

interface FileUploaderProps {
    maxFiles?: number
    maxSize?: number
    onFilesUploaded?: (files: FileInfoDto[]) => void
    onFilesLoading?: (files: String[]) => void
}

export interface FileUploaderInterface {
    delete: (id: string) => void | undefined
}

export const FileUploader = forwardRef<FileUploaderInterface, FileUploaderProps>((props, ref) => {
    const intl = useIntl()

    const [uploadedFiles, setUploadedFiles] = useState<FileInfoDto[]>([])
    const [loadingFiles, setLoadingFiles] = useState<String[]>([])

    const maxSize = props.maxSize ? props.maxSize : 5
    const maxFiles = props.maxFiles ? props.maxFiles : 7
    const disabled = uploadedFiles.length >= maxFiles

    useImperativeHandle(ref, () => ({
        delete: (id) => {
            setUploadedFiles(uploadedFiles.filter((it) => it.id != id))
        },
    }))

    useEffect(() => {
        if (props.onFilesUploaded) {
            props.onFilesUploaded(uploadedFiles)
        }
    }, [uploadedFiles])

    useEffect(() => {
        if (props.onFilesLoading) {
            props.onFilesLoading(loadingFiles)
        }
    }, [loadingFiles])

    const onDrop = async (files: FileWithPath[]) => {
        if (uploadedFiles.length + files.length > maxFiles) {
            notifications.show(
                ErrorNotification(
                    <Text size="sm">
                        <FormattedMessage id={locales.tooManyFiles} />
                    </Text>
                )
            )
            return
        }

        // показать прогресс
        setLoadingFiles(files.map((f) => f.name))

        try {
            const results = await Promise.allSettled(files.map((file) => FilesApiService.uploadFile(file)))

            // соберём только успешно загруженные
            const uploaded = results
                .filter((r): r is PromiseFulfilledResult<any> => r.status === "fulfilled")
                .map((r) => r.value.data)

            // добавляем все загруженные файлы разом
            setUploadedFiles((prev) => [...prev, ...uploaded])
        } finally {
            // скрыть прогресс (даже если часть упала)
            setLoadingFiles([])
        }
    }

    const onReject = (fileRejections: FileRejection[]) => {
        fileRejections.forEach((fileRejection) => {
            const errorCode = fileRejection.errors[0].code
            if (errorCode == ErrorCode.FileTooLarge) {
                showError(
                    fileRejection.file.name,
                    intl.formatMessage({ id: `${locales.errors}.${errorCode}` }, { maxSize: maxSize })
                )
            }
        })
    }

    const showError = (fileName: string, message: string) => {
        notifications.show(
            ErrorNotification(
                <Text fw="bold" size="sm">
                    {intl.formatMessage({ id: locales.fileName }, { fileName: fileName })}
                </Text>,
                <Text size="sm">{message}</Text>
            )
        )
    }

    return (
        <Dropzone
            onDrop={onDrop}
            onReject={onReject}
            disabled={disabled}
            maxFiles={maxFiles}
            maxSize={maxSize * 1024 ** 2}
            loading={loadingFiles.length !== 0}
        >
            <Flex justify="center" align="center" columnGap="md">
                <Dropzone.Accept>
                    <IconUpload className={`${classes.icon} ${classes.iconAccept}`} />
                </Dropzone.Accept>
                <Dropzone.Reject>
                    <IconX className={`${classes.icon} ${classes.iconReject}`} />
                </Dropzone.Reject>
                <Dropzone.Idle>
                    <IconFiles className={`${classes.icon} ${classes.iconIdle}`} />
                </Dropzone.Idle>

                <Flex className={classes.description}>
                    <Text className={classes.title}>
                        <FormattedMessage id={locales.title} />
                    </Text>
                    <Text className={classes.subTitle}>
                        <FormattedMessage id={locales.description} values={{ maxFiles: maxFiles, maxSize: maxSize }} />
                    </Text>
                </Flex>
            </Flex>
        </Dropzone>
    )
})
