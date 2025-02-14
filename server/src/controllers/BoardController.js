
export async function createBoard(req, res) {
    const { name, description, privacy, tags, coverImage } = req.body;

    const newBoard = await BoardModel.create({
      name,
      description: description || "",
      privacy: privacy || "public",
      tags: tags || [],
      coverImage: coverImage || "",
      createdBy: req.user, 
      posts: [],
    });

    // Send response
    res.status(201).json({
      status: "success",
      data: {
        board: newBoard,
      },
    });
}

export async function getAllBoard(req, res) {}

export async function getBoardById(req, res) {}

export async function updateBoard(req, res) {}

export async function deleteBoard(req, res) {}

export async function addPost(req, res) {}

export async function deletePost(req, res) {}

export async function getAllPosts(req, res) {}

export async function searchBoards(req, res) {}

export async function getBoardsbyUser(req, res) {}

export async function getUserBoards(req, res) {}

export async function addTags(req, res) {}
