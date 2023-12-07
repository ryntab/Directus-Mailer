export default (router, { services, env }) => {
  const { AssetsService, MailService } = services;

  router.post("/", async (req, res, schema) => {
    const mailService = new MailService({
      accountability: req.accountability,
      schema: schema,
    });

    const assetsService = new AssetsService({
      accountability: req.accountability,
      schema: req.schema,
    });

    const { body } = req;

    let authorityCheck = () => {
      if (env.EMAIL_ALLOW_GUEST_SEND == null || !env.EMAIL_ALLOW_GUEST_SEND) {
        return req.accountability.user == null ||
          req.accountability.role == null
          ? false
          : true;
      } else {
        return true;
      }
    };

    let attachments = async (fileIDS) => {
      let attachments = new Array();

      let streamAttachments = new Array();

      // Resolve all streams to an array
      streamAttachments = await Promise.allSettled(
        fileIDS.map(function (id) {
          return assetsService.getAsset(id, {transformationParams: {}});
        })
      );

      // Filter out all rejected promises
      const resolvedAttachments = streamAttachments.filter(
        (attachment) => attachment.status === "fulfilled"
      );

      // Create attachment objects from streams
      resolvedAttachments.forEach((asset) => {
        const { stream, file } = asset.value;
        let attachment = new Object();
        attachment.contentType = file.type;
        attachment.filename = file.filename_download;
        attachment.content = stream;
        attachments.push(attachment);
      });

      //Return our array of formatted attachments
      return attachments;
    };

    let create = async (body) => {
      let mail = new Object();

      mail.to = body.to;
      mail.template = body.template;
      mail.subject = body.subject;
      mail.attachments = body.attachments;
      mail.list = body.list;

      if (mail.attachments == null) {
        mail.attachments = new Array();
      }

      if (body.files != null && body.files.length > 0) {
        let streams = await attachments(body.files);
        mail.attachments = mail.attachments.concat(streams);
      }

      return mail;
    };

    let send = async (email) => {
      if (authorityCheck()) {
        await mailService.send(email).then(() => {
          res.send("sent");
        });
      } else {
        return res.status(400).send({
          message:
            "User not authorized, enable guest sending or include a token",
        });
      }
    };

    send(await create(body));
  });
};
