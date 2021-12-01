const db = require('../../config/db');
const { age, date } = require('../../lib/utils.js');

module.exports = {
  // Metodo que seleciona da tabela todos os dados
  // Usamos como parametro uma função que será chamada
  // após seleciona no banco de dados
  all(callback) {
    db.query(
      `SELECT instructors.*, count(members) AS total_members
    FROM instructors 
    LEFT JOIN members ON (instructors.id = members.instructor_id)
    GROUP BY instructors.id
    ORDER BY total_members DESC`,
      function (err, results) {
        if (err) throw err;

        // Apos selecionar envias para a função
        // a rows da tabela
        callback(results.rows);
      }
    );
  },

  create(data, callback) {
    const query = `
      INSERT INTO instructors(
        name,
        avatar_url,
        gender,
        services,
        birth,
        created_at
      ) VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING id
    `;

    // Substituimos por data já que é
    // o nome que colocamos no parametro
    // eventuamente vai receber o req.body
    const values = [
      data.name,
      data.avatar_url,
      data.gender,
      data.services,
      date(data.birth).iso,
      date(Date.now()).iso
    ];

    db.query(query, values, function (err, results) {
      if (err) throw err;

      // Roda função que passa como parametro
      // os resultados do usario, [0] por no causo é
      // apenas um, já que estamos criando
      callback(results.rows[0]);
    });
  },

  find(id, callback) {
    db.query(
      `SELECT * FROM instructors WHERE id = $1`,
      [id],
      function (err, results) {
        if (err) throw err;

        callback(results.rows[0]);
      }
    );
  },

  findBy(search, callback) {
    db.query(
      `SELECT instructors.*, count(members) AS total_members
      FROM instructors
      LEFT JOIN members ON (instructors.id = members.instructor_id)
      WHERE instructors.name ILIKE '%${search}%'
      OR instructors.services ILIKE '%${search}%'
      GROUP BY instructors.id
      ORDER BY total_members DESC`,
      function (err, results) {
        if (err) throw err;

        callback(results.rows);
      }
    );
  },

  update(data, callback) {
    // Colocamos na query os dados que atualizamos na pagina de editar
    const query = `
      UPDATE instructors SET
      avatar_url=($1),
      name=($2),
      birth=($3),
      gender=($4),
      services=($5)
      WHERE id = $6
    `;

    const values = [
      data.avatar_url,
      data.name,
      date(data.birth).iso,
      data.gender,
      data.services,
      data.id
    ];

    db.query(query, values, function (err, results) {
      if (err) throw err;

      callback();
    });
  },

  delete(id, callback) {
    db.query(
      `DELETE FROM instructors WHERE id = $1`,
      [id],
      function (err, results) {
        if (err) throw err;

        callback();
      }
    );
  },

  paginate(params) {
    const { filter, limit, offset, callback } = params;

    let query = '',
      filterQuery = '',
      totalQuery = ` (
      SELECT count(*) FROM instructors
    ) AS total`;

    // Se não house filtro apenas selecionar os instructors e contar os membros

    // Se houver filtro faz mesma coisa da query de cima e adiciona o where ilike
    if (filter) {
      filterQuery = `
      WHERE instructors.name ILIKE '%${filter}%'
      OR instructors.services ILIKE '%${filter}%'
      `;

      totalQuery = `(
          SELECT count(*) FROM instructors
          ${filterQuery}
      ) AS total`;
    }

    query = `SELECT instructors.*, ${totalQuery}, count(members) AS total_members
    FROM instructors
    LEFT JOIN members ON (instructors.id = members.instructor_id)
    ${filterQuery}
    GROUP BY instructors.id LIMIT $1 OFFSET $2
    `;

    // Executamos passando nosso limite e nosso offset e retornar
    // os instructors
    db.query(query, [limit, offset], function (err, results) {
      if (err) throw err;

      callback(results.rows);
    });
  }
};
